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
#  date_cancelled     :date
#  starred            :date
#  received           :boolean          default(FALSE)
#  last_user          :string(255)
#  created_at         :datetime
#  updated_at         :datetime
#

class Purchase < ActiveRecord::Base
  using_access_control

  include ActionView::Helpers::NumberHelper

  has_many :attachments, dependent: :destroy
  has_many :line_items, dependent: :destroy
  has_many :notes, dependent: :destroy
  has_many :purchase_to_tags, dependent: :destroy
  has_many :tags, through: :purchase_to_tags
  has_many :receivings, dependent: :destroy
  has_many :receiving_lines, through: :receivings
  has_many :purchase_to_vendors, dependent: :destroy
  has_many :vendors, through: :purchase_to_vendors
  has_many :accounts, through: :requester

  belongs_to :requester, class_name: 'User', foreign_key: 'requester_id'
  belongs_to :recipient, class_name: 'User', foreign_key: 'recipient_id'
  belongs_to :buyer, class_name: 'User', foreign_key: 'buyer_id'
  belongs_to :account

  before_save :update_last_user
  after_save :update_received

  accepts_nested_attributes_for :notes, reject_if: lambda { |attr| attr['text'].blank? }, allow_destroy: true
  accepts_nested_attributes_for :accounts, reject_if: lambda { |attr| attr['number'].blank? }
  accepts_nested_attributes_for :attachments, reject_if: lambda { |attr| attr['attachment_file_name'].blank? }, allow_destroy: true
  accepts_nested_attributes_for :purchase_to_tags, allow_destroy: true
  accepts_nested_attributes_for :line_items, reject_if: lambda { |attr| attr['description'].blank? && attr['quantity'].blank? }, allow_destroy: true

  scope :buyer, ->(val){ (val.nil? || val=='all') ? all : where(buyer_id: val.to_i) }
  scope :eager_lines, -> { includes({ line_items: :receiving_lines }) }
  scope :eager_min, -> { eager_lines.includes(:vendors, :tags, :buyer, :requester, :recipient,
                                            { receivings: :receiving_lines }) }
  scope :eager_all, -> { eager_min.includes(:attachments, :account, :notes,
                                          { requester: :accounts }, :recipient) }
  scope :dates, ->(min, max) { where('date_requested >= ? and date_requested <= ?', Time.parse(min), Time.parse(max)) }
  scope :vendor, ->(vendor) { (vendor.nil? || vendor.empty?) ?
                                all :
                                where('vendors.name like ?', "%#{vendor}%").references(:vendors) }
  scope :date_within_range, ->(field, date, range) { where(field => date-range..date+range) }
  scope :include_receiving, ->(isTrue, isEmpty) {
    if isTrue == 2 && isEmpty == 2
      all
    elsif isTrue == 1 && isEmpty == 1
      none
    elsif isTrue == 1 && isEmpty == 2
      where('received is NULL or received = FALSE')
    else
      where('received = TRUE')
    end
  }

  # Build filter query from current tab for scope
  scope :canceled, -> { where ('date_cancelled is NOT NULL') }
  scope :not_canceled, -> { where ('date_cancelled is NULL') }
  scope :reconciled, -> { where ('date_cancelled is NOT NULL') }
  scope :not_reconciled, -> { where ('date_cancelled is NULL') }
  scope :assigned, -> { where('buyer_id is NOT NULL') }
  scope :not_assigned, -> { where('buyer_id is NULL') }
  scope :purchased, -> { where('date_purchased is NOT NULL') }
  scope :not_purchased, -> { where('date_purchased is NULL') }

  scope :tab, ->(tab) {
    case(tab)
    when 'New'
      not_canceled.not_assigned
    when 'Cancelled'
      canceled
    when 'Reconciled'
      not_canceled.reconciled
    when 'Pending'
      not_canceled.not_reconciled.assigned.not_purchased
    when 'Purchased'
      not_canceled.not_reconciled.assigned.purchased
    end
  }

  # Build sort query for scope
  scope :sorted, ->(field, dir) { get_sort_order(field, dir).order( "starred DESC") }

  def self.get_sort_order(field, direction)
    direction = ['ASC', 'DESC'].include?(direction) ? direction : 'DESC'

    case(field)
    when 'date' then order("date_requested #{direction}")
    when 'vendor' then joins(:vendors).order("vendors.name #{direction}")
    when 'requester' then joins('LEFT OUTER JOIN users AS requester ON requester.id = purchases.requester_id').order("requester.last_name #{direction}")
    when 'department' then joins('LEFT OUTER JOIN users AS requester ON requester.id = purchases.requester_id').order("requester.department #{direction}")
    when 'buyer' then joins('LEFT OUTER JOIN users AS buyer ON buyer.id = purchases.buyer_id').order("buyer.last_name #{direction}")
    else order("date_requested #{direction}")
    end
  end

  # For fallback search when solr fails
  scope :search_lines, ->(text){
    return scoped if text.blank?
    joins(:line_items).
    where('purchases.tracking_num LIKE ?
           OR line_items.description LIKE ?',
          *["%#{text}%"]*2)
  }

  searchable do
    text :tracking_num
    text :courier
    text :order_number
    text :order_confirmation

    text :lines, :boost => 2, :stored => true do
      line_items.map { |line| line.description }
    end
    text :buyer do
      buyer.name unless buyer.nil?
    end
    text :requester do
      requester.name unless requester.nil?
    end
    text :vendors do
      vendors.map { |vendor| vendor.name }
    end

    date :date_approved
    date :date_requested
    date :date_required
    date :date_expected
    date :date_purchased
    date :date_reconciled
    date :date_posted
    date :date_cancelled

    date :starred

    boolean :received

  end


  def update_last_user
    if Authorization.current_user && Authorization.current_user.respond_to?(:name)
      self.last_user = Authorization.current_user.name
    end
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
    self.requester_id = get_user_from_param(params) unless params.nil?
  end

  def recipient=(params)
    self.recipient_id = get_user_from_param(params) unless params.nil?
  end

  def buyer=(params)
    self.buyer_id = get_user_from_param(params) unless params.nil?
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
    super parse_date date
  end
  def date_requested=(date)
    super parse_date date
  end
  def date_required=(date)
    super parse_date date
  end
  def date_expected=(date)
    super parse_date date
  end
  def date_purchased=(date)
    super parse_date date
  end
  def date_reconciled=(date)
    super parse_date date
  end
  def date_posted=(date)
    super parse_date date
  end
  def date_cancelled=(date)
    super parse_date date
  end
  def starred=(date)
    super parse_date date
  end

  def tax_rate=(rate)
    super rate.gsub('%', '').to_f / 100
  end

  def update_received
    lines = self.line_items.reload
    if lines.map(&:quantity).sum == 0
      current_val = false
    else
      current_val = lines.map(&:remaining).sum == 0
    end

    unless self.received == current_val
      self.update_attribute(:received, current_val) # Bypass validations
    end
  end

  def receive_all
    received_items = false

    if self.received
      self.errors.add 'Lines', 'All items have been received'
      return false
    end

    Purchase.transaction do
      new_doc = self.receivings.create
      self.line_items.each do |line|
        if line.remaining > 0
          received_items = true
          new_doc.receiving_lines << ReceivingLine.create(quantity: line.remaining, line_item_id: line.id)
        end
      end

      if received_items
        self.update_received
      else
        self.errors.add 'Lines', 'Unable to find items to receive'
        raise ActiveRecord::Rollback
      end
    end

    received_items
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
    if value == true || value == 'true'
      self.update(date_reconciled: Time.now) if self.date_cancelled.nil?
    else
      self.update(date_reconciled: nil)
    end
  end

  private

  def parse_date(date)
    return date unless date.is_a? String
    return if date.nil? || date.empty?

    # TODO Need smarter parsing, this only works with "Nov 17, 2013"
    Date.parse(date)
  end

  def symbolize_keys(hashes)
    hashes.inject({}){ |result, (key,val)| result[key.to_sym] = val; result }
  end

end
