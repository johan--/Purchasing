module ApplicationHelper

  # From Biola Apps
  def navigation_menu
    Settings.ui.menu.map do |set|
      navigation_link set.to_hash
    end.join(" ").html_safe
  end

  def navigation_link(settings)
    # Get settings and set defaults
    type = settings[:type].to_sym
    controller = settings[:controller].try(:to_sym)
    url =  settings[:url] || settings[:action] || controller
    text = settings[:text] || settings[:url].capitalize
    icon = settings[:icon]

    # Check permissions
    if controller.nil? || permitted_to?(:index, controller)

      # Icon
      icon_tag = icon ? content_tag('i', nil, class: "fa #{icon} fa-lgx") : nil

      # Link tag
      case type
      when :action
        "<li {{action 'open#{url.capitalize}'}}><a>#{text}#{icon_tag}</a></li>".html_safe
      when :link_to
        # Have to do this manually since hamlbars isn't catching the _action tag
        link = "{{#link-to '#{url}'}}#{text}#{icon_tag}{{/link-to}}".html_safe
        content_tag(:li, link)
      when :url
        link = link_to("#{icon_tag}#{text}".html_safe, "/#{url}", title: text)
        content_tag(:li, link)
      end
    end
  end
end
