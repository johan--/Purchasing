
class PurchaseSerializer < ActiveModel::Serializer

  embed:ids, include: true

  attributes :id, :tracking_num, :buyer, :requester, :recipient,
             :starred, :date_requested, :date_approved, :date_requested,
             :date_purchased, :date_expected, :date_required, :received,
             :date_reconciled, :title_text

  has_many :tags
  has_many :purchase_to_tags
  has_many :vendors

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
      object.line_items.map do |line|
        content_tag(:div, class: 'tooltip_item') do
          ( content_tag(:div, line.quantity, class: 'tooltip_quantity') +
            content_tag(:div, line.unit, class: 'tooltip_unit') +
            content_tag(:div, line.description, class: 'tooltip_description')
          )
        end
      end.join('')
    end
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
end
