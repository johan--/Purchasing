
class PurchaseSerializer < ActiveModel::Serializer

  embed:ids, include: true

  attributes :id, :tracking_num, :buyer, :requester, :recipient,
             :starred, :date_requested, :date_approved, :date_requested,
             :date_purchased, :date_expected, :date_required, :received,
             :date_reconciled, :title_text, :tax_rate, :shipping, :labor

  has_many :tags
  has_many :purchase_to_tags
  has_many :vendors
  has_many :line_items
  has_many :receivings

  def date_requested
    format_date object.date_requested
  end

  def date_approved
    format_date object.date_approved
  end

  def date_purchased
    format_date object.date_purchased
  end

  def date_expected
    format_date object.date_expected
  end

  def date_required
    format_date object.date_required
  end

  def date_reconciled
    format_date object.date_reconciled
  end

  def buyer
    serialize_user object.buyer
  end

  def requester
    serialize_user object.requester
  end

  def recipient
    serialize_user object.recipient
  end

  def format_date(date)
    return if date.nil?
    date.strftime("%b %-d, %Y")
  end

  def serialize_user(user)
    unless user.nil?
      { id: user.id, name: user.name, department: user.department, phone: user.phone }
    end
  end

  def title_text
    content_tag(:div, class: 'tooltip_items') do
      get_line_items
    end
  end

  def get_line_items
    object.line_items.map do |line|
      content_tag(:div, class: get_received_class(line)) do
        content_tag(:div, line.quantity, class: 'tooltip_quantity') +
        content_tag(:div, line.unit, class: 'tooltip_unit') +
        content_tag(:div, line.description, class: 'tooltip_description')
      end
    end.join('')
  end

  # Modified from Rails helper
  def content_tag(name, content_or_options_with_block = nil, options = nil, &block)
    if block_given?
      options = content_or_options_with_block if content_or_options_with_block.is_a?(Hash)
      content_tag_string(name, yield(block), options)
    else
      content_tag_string(name, content_or_options_with_block, options)
    end
  end

  def content_tag_string(name, content, options)
    tag_options = tag_options(options) if options
    "<#{name}#{tag_options}>#{content}</#{name}>".html_safe
  end

  def tag_options(options, escape = true)
    attrs = []
    options.each_pair do |key, value|
      if !value.nil?
        final_value = value.is_a?(Array) ? value.join(" ") : value
        attrs << %(#{key}="#{final_value}")
      end
    end
    " #{attrs.sort * ' '}".html_safe unless attrs.empty?
  end

  def get_received_class(line)
    'tooltip_item ' +
      if line.quantity == 0 || line.total_received == 0
        ''
      elsif line.total_received >= line.quantity
        'complete'
      else
        'partial'
      end
  end
end
