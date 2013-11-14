module ApplicationHelper

  # From Biola Apps
  def navigation_menu
    Settings.ui.menu.map do |set|
      navigation_link set.to_hash
    end.join(" ").html_safe
  end

  def navigation_link(settings)
    # Get settings and set defaults
    action = (settings[:action] || :index).to_sym
    controller = settings[:controller]
    controller_sym = controller.try(:parameterize,'_').try(:to_sym)
    controller_name = controller.try(:split,'/').try(:last).try(:downcase)
    controller_name_class = (controller_name.nil?) ? '' : "nav_#{controller_name}"
    url =  settings[:url] || controller
    text = settings[:text] || controller_name.try(:humanize)
    css_class = (settings[:css_class].nil?) ? '' : "nav_#{settings[:css_class]}"
    icon = settings[:icon]
    modal = settings[:modal]

    # Check permissions
    if controller.blank? || permitted_to?(action, controller_sym)

      # HTML element classes
      class_attr_val = [controller_name_class, action, css_class].join(' ')

      # Icon
      icon_tag = icon ? content_tag('i', nil, class: "fa #{icon} fa-lgx") : nil

      # Link tag
      if modal == true
        # Have to do this manually since hamlbars isn't catching the _action tag
        "<li {{action 'open#{text}'}} class='#{class_attr_val}'><a>#{text}#{icon_tag}</a></li>".html_safe
      else
        link = "{{#link-to '#{url.to_s}'}}#{text}#{icon_tag}{{/link-to}}".html_safe
        content_tag(:li, link, class: class_attr_val)
      end

    end
  end
end
