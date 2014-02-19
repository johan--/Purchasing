# == Schema Information
#
# Table name: purchases
#
#  id                 :integer          not null, primary key
#  buyer_id           :integer
#  requester_id       :integer
#  recipient_id       :integer
#  account_id         :integer
#  tracking_num       :string(255)
#  courier            :string(255)
#  approved_by        :string(255)
#  order_number       :string(255)
#  order_confirmation :string(255)
#  vendor_string      :string(255)
#  purchase_type      :string(255)
#  labor              :decimal(8, 2)    default(0.0)
#  shipping           :decimal(8, 2)    default(0.0)
#  tax_rate           :decimal(8, 4)    default(0.1)
#  date_approved      :date
#  date_requested     :date
#  date_required      :date
#  date_expected      :date
#  date_purchased     :date
#  date_reconciled    :date
#  date_posted        :date
#  date_canceled      :date
#  starred            :date
#  received           :boolean          default(FALSE)
#  last_user          :string(255)
#  created_at         :datetime
#  updated_at         :datetime
#

class Purchase < ActiveRecord::Base
  using_access_control

  include ActionView::Helpers::NumberHelper

  has_many :line_items, inverse_of: :purchase, dependent: :destroy
  has_many :notes, inverse_of: :purchase, dependent: :destroy
  has_many :purchase_to_tags, inverse_of: :purchase, dependent: :destroy
  has_many :purchase_to_vendors, inverse_of: :purchase, dependent: :destroy
  has_many :receivings, inverse_of: :purchase, dependent: :destroy
  has_many :attachments, inverse_of: :purchase, dependent: :destroy

  has_many :tags, through: :purchase_to_tags, inverse_of: :purchases
  has_many :vendors, through: :purchase_to_vendors, inverse_of: :purchases

  has_many :receiving_lines, through: :receivings, inverse_of: :purchases
  has_many :accounts, through: :requester, inverse_of: :purchases

  belongs_to :requester, class_name: 'User', foreign_key: 'requester_id'
  belongs_to :recipient, class_name: 'User', foreign_key: 'recipient_id'
  belongs_to :buyer, class_name: 'User', foreign_key: 'buyer_id'
  belongs_to :account, inverse_of: :purchases

  before_save :update_last_user
  before_save :update_vendor_string
  before_destroy { |record| (record.date_purchased.blank?) ? true : false }

  after_save :update_received
  after_touch :index

  validates :purchase_type, presence: { message: 'A purchase type is required' }
  validates :date_requested, presence: { message: 'Date requested cannot be blank' }
  validates :account, absence: { message: 'Cannot add an account without a requester' },
                         if: Proc.new { |p| p.requester_id.blank? }
  validates :account, inclusion: { in: Proc.new { |p| p.accounts },
                                   message: 'Cannot add an account that does not belong to the requester' },
                                   unless: Proc.new { |p| p.account.blank? }
  validates :date_canceled, absence: { message: 'Cannot cancel a requisition that has not been purchased' },
                            if: Proc.new { |p| p.date_purchased.blank? }

  accepts_nested_attributes_for :notes, reject_if: lambda { |attr| attr['text'].blank? }, allow_destroy: true
  accepts_nested_attributes_for :accounts, reject_if: lambda { |attr| attr['number'].blank? }
  accepts_nested_attributes_for :attachments, reject_if: lambda { |attr| attr['attachment_file_name'].blank? }, allow_destroy: true
  accepts_nested_attributes_for :purchase_to_tags, allow_destroy: true
  accepts_nested_attributes_for :line_items, reject_if: lambda { |attr| attr['description'].blank? && attr['quantity'].blank? }, allow_destroy: true

  scope :buyer, ->(val){ (val.blank? || val=='all') ? all : where(buyer_id: val.to_i) }
  scope :pur_type, ->(val){ where(purchase_type: val) }

  scope :eager_lines, -> { includes({ line_items: :receiving_lines }) }
  scope :eager_min, -> { includes(:line_items, :tags, :purchase_to_tags, :buyer, :requester, :receivings) }
  scope :eager_all, -> { eager_min.includes(:attachments, :account, :notes,
                                          { receivings: :receiving_lines },
                                          { line_items: :receiving_lines },
                                          { requester: :accounts }, :recipient) }

  scope :eager_receiving, -> { includes(:vendors, :line_items,
                                        { :receivings => { receiving_lines: :line_item }},
                                        { line_items: :receiving_lines }) }

  # Build filter query from current tab for scope
  scope :canceled, -> { where('date_canceled is NOT NULL') }
  scope :not_canceled, -> { where('date_canceled is NULL') }
  scope :reconciled, -> { where('date_reconciled is NOT NULL') }
  scope :not_reconciled, -> { where('date_reconciled is NULL') }
  scope :assigned, -> { where('buyer_id is NOT NULL') }
  scope :not_assigned, -> { where('buyer_id is NULL') }
  scope :purchased, -> { where('date_purchased is NOT NULL') }
  scope :not_purchased, -> { where('date_purchased is NULL') }

  scope :tab, ->(tab) {
    case(tab)
    #when 'New'
    #  not_canceled.not_reconciled.not_assigned
    #when 'Pending'
    #  not_canceled.not_reconciled.assigned.not_purchased
    when 'Purchased'
      not_canceled.not_reconciled #.assigned.purchased
    when 'Reconciled'
      not_canceled.reconciled
    when 'Canceled'
      canceled
    when 'Starred'
      where('starred is NOT NULL')
    end
  }

  # Build sort query for scope
  scope :sorted, ->(field, dir) { order( "starred DESC").get_sort_order(field, dir) }

  def self.get_sort_order(field, direction)
    direction = ['ASC', 'DESC'].include?(direction) ? direction : 'DESC'

    case(field)
    when 'dateRequested' then order("date_requested #{direction}")
    when 'vendor_string' then joins(:vendors).order("vendors.name #{direction}")
    when 'requester.name' then joins('LEFT OUTER JOIN users AS requester ON requester.id = purchases.requester_id').order("requester.last_name #{direction}")
    when 'requester.department' then joins('LEFT OUTER JOIN users AS requester ON requester.id = purchases.requester_id').order("requester.department #{direction}")
    when 'buyer.name' then joins('LEFT OUTER JOIN users AS buyer ON buyer.id = purchases.buyer_id').order("buyer.last_name #{direction}")
    else order("date_requested #{direction}")
    end
  end

  searchable do
    text :tracking_num, :courier, :order_number, :order_confirmation, :purchase_type

    text :lines, :boost => 2, :stored => true do
      line_items.map { |line| line.description }
    end
    text :buyer do
      buyer.name unless buyer.nil?
    end
    text :requester do
      requester.name unless requester.nil?
    end
    text :recipient do
      recipient.name unless recipient.nil?
    end
    text :department do
      requester.department unless requester.nil?
    end
    text :vendors do
      vendors.map { |vendor| vendor.name }
    end

    date :date_requested
    date :date_expected
    date :date_purchased

    boolean :received

    # Sort fields
    date :starred

    string :buyer_sort do
      buyer.try(:name)
    end
    string :requester_sort do
      requester.try(:last_name)
    end
    string :department_sort do
      requester.try(:department).try(:name)
    end
    string :vendor_sort do
      vendors.first.try(:name)
    end
  end

  def update_last_user
    if Authorization.current_user && Authorization.current_user.respond_to?(:name)
      self.last_user = Authorization.current_user.name
    end
  end

  def update_vendor_string
    self.vendor_string = vendors_list.join(', ')
  end

  def vendors_list
    self.vendors.map { |vend| vend.name }
  end

  def vendors=(params)
    # Delete all vendors
    if params.nil? || params.empty?
      self.vendors.destroy_all

    else
      new_vendors = JSON.parse params
      new_vendors = [new_vendors] if new_vendors.is_a? Hash
      new_vendors.map!{ |v| symbolize_keys(v) }
      cur_vendors = self.vendors.map { |vend| { name: vend.name, id: vend.id } }

      # Delete removed records
      (cur_vendors - new_vendors).each do |one_vendor|
        vendor = self.vendors.find_by(name: one_vendor[:name])
        self.vendors.delete(vendor)
      end

      # Add new records
      (new_vendors - cur_vendors).each do |one_vendor|
        vendor = Vendor.find_or_create_by(name: one_vendor[:name])
        self.vendors << vendor
      end
    end
  end

  def requester=(params)
    self.requester_id = get_user_from_param(params)
  end

  def recipient=(params)
    self.recipient_id = get_user_from_param(params)
  end

  def buyer=(params)
    self.buyer_id = get_user_from_param(params)
  end

  def get_user_from_param(params)
    return nil if params.nil?
    if params.is_a? String
      params.to_i
    elsif params.is_a? Integer
      params
    elsif params.is_a? User
      params.id
    end
  end

  # This is ugly, but I'm not sure of a better way for Rails to accurately save these
  def date_approval=(date)
    super parse_date(date)
  end
  def date_requested=(date)
    super parse_date(date)
  end
  def date_required=(date)
    super parse_date(date)
  end
  def date_expected=(date)
    super parse_date(date)
  end
  def date_purchased=(date)
    super parse_date(date)
  end
  def date_reconciled=(date)
    super parse_date(date)
  end
  def date_posted=(date)
    super parse_date(date)
  end
  def date_canceled=(date)
    super parse_date(date)
  end
  def starred=(date)
    super parse_date(date)
  end

  def parse_date(date)
    if (date.is_a? DateTime) || (date.is_a? Date) || (date.is_a? Time)
      Chronic.parse(date.strftime '%m/%d/%Y %H:%M:%S')
    else
      Chronic.parse date
    end
  end

  def tax_rate=(rate)
    super rate.gsub('%', '').to_f / 100
  end

  def new_attachments=(attachments)
    attachments.each do |id|
      attachment = Attachment.find(id.to_i)
      attachment.update(category: 'Requisition')
      self.attachments << attachment
    end
  end

  def receive_all
    received_items = false
    new_doc = nil

    Purchase.transaction do
      new_doc = self.receivings.new

      self.line_items.each do |line|
        items_left = line.remaining

        if items_left > 0
          received_items = true
          new_doc.receiving_lines.new(quantity: items_left, line_item_id: line.id)
        end

      end

      # Raise errors
      if !received_items
        self.errors.add 'Lines', 'Unable to find items to receive'
        raise ActiveRecord::Rollback

      elsif !new_doc.save
        self.errors.add 'Receiving', "There was an error saving the receiving document: #{new_doc.errors.full_messages}"
        raise ActiveRecord::Rollback

      elsif new_doc.errors.any?
        self.errors.add 'Receiving', "The receiving doc raised an error: #{new_doc.errors.full_messages}"
        raise ActiveRecord::Rollback

      elsif self.errors.any?
        raise ActiveRecord::Rollback

      else
        return new_doc

      end
    end
  end

  def update_received
    # This will generate new SQL queries for line items
    lines = self.line_items.reload

    if lines.map(&:quantity).sum > 0
      remaining_sum = lines.map(&:remaining).sum
      tested_val = remaining_sum <= 0
    end

    # Always update, just incase there is a conflict with multiple receiving docs
    self.update_column(:received, tested_val)
  end

  def self.reconcile(ids, value = true)
    return nil if !ids.is_a? Array

    purchases = Purchase.eager_lines.find(ids)
    errors = []

    purchases.each do |purchase|
      errors << purchase.errors unless purchase.reconcile(value)
    end

    errors
  end

  def reconcile(value = true)
    # Use update_columns to bypass callbacks
    if value == true || value == 'true'
      self.update_columns(date_reconciled: Time.now) if self.date_canceled.nil?
    else
      self.update_columns(date_reconciled: nil)
    end
  end

  def self.assign(ids, buyer_id)
    return ['Bad formatting'] if !ids.is_a? Array

    purchases = Purchase.find(ids)
    errors = []

    purchases.each do |purchase|
      if !buyer_id.nil? && !buyer_id.empty? && !purchase.buyer.nil?
        errors << 'A buyer already exists'
      else
        errors << purchase.errors unless purchase.update(buyer_id: buyer_id)
      end
    end

    errors
  end

  def sub_total
    line_items.map(&:total).sum
  end

  def total
    (sub_total * (1 + self.tax_rate)) + self.shipping + self.labor
  end

  private

  def symbolize_keys(hashes)
    hashes.inject({}){ |result, (key,val)| result[key.to_sym] = val; result }
  end

end
