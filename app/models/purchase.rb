# == Schema Information
#
# Table name: purchases
#
#  id              :integer          not null, primary key
#  buyer_id        :integer
#  requester_id    :integer
#  account_id      :integer
#  tracking_num    :string(255)
#  approved_by     :string(255)
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

  accepts_nested_attributes_for :notes, reject_if: lambda { |attr| attr['note'].blank? }, allow_destroy: true
  accepts_nested_attributes_for :purchase_to_tags, allow_destroy: true
  accepts_nested_attributes_for :line_items, reject_if: lambda { |attr| attr['description'].blank? || attr['quantity'].blank? }, allow_destroy: true
  accepts_nested_attributes_for :receivings, allow_destroy: true
  accepts_nested_attributes_for :receiving_lines, reject_if: lambda { |attr| attr['quantity'].blank? }, allow_destroy: true

  scope :sorted, ->(field) { order("id desc").order(get_sort_order(field)).order( "starred desc") }
  scope :buyer, ->(val){ (val.nil? || val.to_i==0) ? all : where(buyer_id: val.to_i) }
  scope :eager_min, -> { includes(:line_items, :vendors, :tags, :account, :buyer, { requester: :accounts} ) }
  scope :eager_all, -> { eager_min.includes(:attachments, :notes, {receivings: :receiving_lines}, :requester) }
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
  def self.get_sort_order(field)
    fields = field.downcase.split('-')

    field_name = case(fields[0])
    when 'date' then 'date_requested'
    when 'vendor' then ''  # TODO
    when 'requester' then 'requester_id' # TODO
    when 'department' then 'requester_id' # TODO
    when 'buyer' then 'buyer_id' # TODO 
    else 'date_requested' 
    end

    field_dir = (fields[1]=='asc') ? 'ASC' : 'DESC'
    "#{field_name} #{field_dir}"
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

  # Get description for purchases list
  def description
    self.notes.map(&:note).join("\n")
  end

  def sub_total
    line_items.map(&:total).sum
  end
  
  def tax
    sub_total * Settings.app.tax_rate.to_f # TODO use tax_rate
  end

  def total
    (sub_total * (1 + self.tax)) + self.shipping + self.labor
  end

  def set_request_date
    self.date_requested ||= Time.now if self.date_requested.nil?
  end

  def vendor_tokens=(tokens)
    cur_vendors = self.vendors
    
    if tokens.empty? && cur_vendors.length > 0
      cur_vendors.destroy
    else
      tokens = tokens.split(',')
      cur_vendors = cur_vendors.map(&:name)

      # Delete removed records
      (cur_vendors - tokens).each{ |vend| self.vendors.find_by(name: vend).destroy }

      # Add new records
      (tokens - cur_vendors).each do |name|
        vendor = Vendor.find_or_create_by( name: name )
        self.purchase_to_vendors.create(vendor_id: vendor.id)
      end
    end
  end

  def vendors_list
    self.vendors.map { |vend| vend.name }
  end

  def requester_tokens=(ids)
    self.requester_id = ids.split(",").first
  end

  def recipient_tokens=(ids)
    self.recipient_id = ids.split(",").first
  end

  def errors_with_children
    self.errors.messages.reduce([]){|res,v| res << [:error, v[1][0]]; res}
  end

  def set_starred(truth)
    if truth == 'true'
      self.update_attributes(starred: Time.now)
    else
      self.update_attributes(starred: nil)
    end  
  end

  def starred?
    (self.starred.nil? || self.starred.blank?) ? false : true
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

  def parse_date(date)
    return date unless date.is_a? String
    return if date.nil? || date.empty?
    Date.parse(date)
  end
  
  private
  
  def set_defaults
    self.date_expected = Time.now + 7.days if self.date_expected.nil?
    self.tax_rate = Settings.app.tax_rate.to_f if self.tax_rate.nil?
  end

  memoize :tax
  memoize :sub_total
end
