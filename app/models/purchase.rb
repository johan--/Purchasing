# == Schema Information
#
# Table name: purchases
#
#  id              :integer          not null, primary key
#  buyer_id        :integer
#  requester_id    :integer
#  recipient_id    :integer
#  account_id      :integer
#  tracking_num    :string(255)
#  approved_by     :string(255)
#  labor           :decimal(8, 2)    default(0.0)
#  shipping        :decimal(8, 2)    default(0.0)
#  tax_rate        :decimal(8, 2)    default(0.0)
#  date_approved   :date
#  date_requested  :date
#  date_purchased  :date
#  date_expected   :date
#  date_required   :date
#  date_received   :date
#  date_reconciled :date
#  starred         :date
#  last_user       :string(255)
#  created_at      :datetime
#  updated_at      :datetime
#

require 'memoist'

class Purchase < ActiveRecord::Base
  extend Memoist
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

  belongs_to :requester, class_name: 'User', foreign_key: 'requester_id'
  belongs_to :recipient, class_name: 'User', foreign_key: 'recipient_id'
  belongs_to :buyer, class_name: 'User', foreign_key: 'buyer_id'
  belongs_to :account

  accepts_nested_attributes_for :notes, reject_if: lambda { |attr| attr['text'].blank? }, allow_destroy: true
  accepts_nested_attributes_for :attachments, reject_if: lambda { |attr| attr['attachment_file_name'].blank? }, allow_destroy: true
  accepts_nested_attributes_for :purchase_to_tags, allow_destroy: true
  accepts_nested_attributes_for :line_items, reject_if: lambda { |attr| attr['description'].blank? || attr['quantity'].blank? }, allow_destroy: true
  accepts_nested_attributes_for :receivings, allow_destroy: true
  accepts_nested_attributes_for :receiving_lines, reject_if: lambda { |attr| attr['quantity'].blank? }, allow_destroy: true

  scope :sorted, ->(field, dir) { get_sort_order(field, dir).order( "starred asc") }
  scope :buyer, ->(val){ (val.nil? || val=='all') ? all : where(buyer_id: val.to_i) }
  scope :eager_min, -> { includes(:line_items, :vendors, :tags, :buyer, :requester, :recipient ) }
  scope :eager_all, -> { eager_min.includes(:attachments, :account, :notes,
                                            { receivings: :receiving_lines },
                                            { line_items: :receiving_lines },  # This doesn't add to the query but does prevent additional queries
                                            { requester: :accounts}, :recipient)
                       }
  scope :tab, ->(tab){ where get_query_from_tab(tab) }

  after_initialize :set_defaults

  # For fallback search when solr fails
  scope :search_lines, ->(text){
    return scoped if text.blank?
    joins(:line_items).
    where('purchases.tracking_num LIKE ?
           OR line_items.description LIKE ?',
          *["%#{text}%"]*2)
  }

  scope :date_within_range, ->(field, date, range) { where(field => date-range..date+range) }

  before_save :update_last_user
  after_initialize :set_request_date

  attr_reader :vendor_tokens
  attr_accessor :vendor_token_array

  #searchable do
  #  text :tracking_num
  #  text :lines, :boost => 2, :stored => true do
  #    line_items.map { |line| line.description }
  #  end
  #  text :requester do
  #    requester.name unless requester.nil?
  #  end
  #  text :buyer do
  #    buyer.name unless buyer.nil?
  #  end
  #  text :vendors_list
  #  date :date_approved
  #  date :date_requested
  #  date :date_purchased
  #  date :date_received
  #  date :date_reconciled
  #end

  # Build sort query for scope
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

  # Build filter query from current tab for scope
  def self.get_query_from_tab(tab)
    case(tab)
    when 'Received'
      "date_received is NOT NULL" # or date_received != ''"
    when 'Reconciled'
      "date_reconciled is NOT NULL" # or date_reconciled != ''"
    else   # Default: on-route
      "date_received is NULL" # or date_received = ''"
    end
  end

  def update_last_user
    self.last_user = "Admin" #current_user.name
  end

  def set_request_date
    self.date_requested ||= Time.now if self.date_requested.nil?
  end

  def vendors_list
    self.vendors.map { |vend| vend.name }
  end

  def vendors=(params)

    cur_vendors = self.vendors

    # Delete all vendors
    if params.empty? && cur_vendors.length > 0
      cur_vendors.destroy

    else
      cur_vendors = cur_vendors.map(&:name)
      params = [params] unless params.is_a? Array

      return
      # TODO- Update since we are no longer dealing with tokens
      # Delete removed records
      (cur_vendors - params).each{ |vend| self.vendors.find_by(name: vend).destroy }

      # Add new records
      (params - cur_vendors).each do |name|
        vendor = Vendor.find_or_create_by( name: name )
        self.purchase_to_vendors.create(vendor_id: vendor.id)
      end
    end
  end

  def requester=(params)
    # TODO: Error check
    self.requester_id = params[id]
  end

  def recipient=(params)
    # TODO: Error check
    self.recipient_id = params[id]
  end

  def buyer=(params)
    # TODO: Error check
    self.buyer_id = params[id]
  end

  # This is ugly, but I'm not sure of a better way for Rails to accurately save these
  def date_approval=(date)
    super parse_date date
  end
  def date_requested=(date)
    super parse_date date
  end
  def date_purchased=(date)
    super parse_date date
  end
  def date_received=(date)
    super parse_date date
  end
  def date_reconciled=(date)
    super parse_date date
  end
  def starred=(date)
    super parse_date date
  end

  def receive_all
    success = false

    Purchase.transaction do
      new_doc = receivings.create
      self.line_items.each do |line|
        remaining = line.quantity - line.receiving_lines.map(&:quantity).sum
        if remaining > 0
          success = true
          new_doc.receiving_lines.create(quantity: remaining, line_item_id: line.id)
        end
      end

      if success
        new_doc.save
      else
        raise ActiveRecord::Rollback
      end
    end

    return success
  end

  private

  def parse_date(date)
    return date unless date.is_a? String
    return if date.nil? || date.empty?
    Date.parse(date)
  end


  def set_defaults
    self.date_expected = Time.now + 7.days if self.date_expected.nil?
    self.tax_rate = Settings.app.tax_rate.to_f if self.tax_rate.nil?
  end

end
