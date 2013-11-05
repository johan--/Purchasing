module ApplicationHelper

  # From Biola Apps
  def navigation_menu
    Settings.ui.menu.map do |set|
      navigation_link set.to_hash.merge({:wrapper=>'li'})
    end.join(" ").html_safe
  end

  def navigation_link(settings)
    # Get settings and set defaults
    action = (settings[:action] || :index).to_sym
    controller = settings[:controller]
    #controller = "/#{controller}" unless controller.blank? || controller.to_s[0] == ?/
    controller_sym = controller.try(:parameterize,'_').try(:to_sym)
    controller_name = controller.try(:split,'/').try(:last).try(:downcase)
    controller_name_class = (controller_name.nil?) ? '' : "nav_#{controller_name}"
    url =  settings[:url] || controller
    text = settings[:text] || controller_name.try(:humanize)
    css_class = (settings[:css_class].nil?) ? '' : "nav_#{settings[:css_class]}"
    wrapper = settings[:wrapper]
    icon = settings[:icon]

    # Check permissions
    if controller.blank? || permitted_to?(action, controller_sym)

      # HTML element classes
      classes = [controller_name_class, action, css_class]
      #classes << 'active' if self.controller.controller_name == controller_name
      class_attr_val = classes.join(' ')

      # Icon
      icon_tag = icon ? content_tag('i', nil, class: "fa #{icon} fa-lgx") : nil

      # Link tag
      link = "{{#link-to '#{url.to_s}'}}#{text}#{icon_tag}{{/link-to}}".html_safe

      # Optional wrapper
      wrapper ? content_tag(wrapper, link, class: class_attr_val) : link
    end
  end
end
