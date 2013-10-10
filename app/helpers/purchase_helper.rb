module PurchaseHelper

  def build_line_items(purchase)
    content_tag(:div, class: 'tooltip_items') do
      purchase.line_items.map do |line|
        content_tag(:div, class: 'tooltip_item') do
          ( content_tag(:div, line.quantity, class: 'tooltip_quantity') +
            content_tag(:div, line.unit, class: 'tooltip_unit') +
            content_tag(:div, line.description, class: 'tooltip_description')
          )
        end
      end.join('')
    end.html_safe
  end

end
