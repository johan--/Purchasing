module ApplicationHelper

  def format_date(date)
    return if date.nil?
    date.strftime("%b %-d, %Y")
  end

  def format_date_short(date)
    return if date.nil?
    date.strftime("%b %-d")
  end

  # Renders a "new line" set of inputs that can be copied within js for new records
  def render_new_line(name, f, association)
    new_object = f.object.class.reflect_on_association(association).klass.new
    f.fields_for(association, new_object, :child_index => "new_#{association}") do |builder|
      render(name, :f => builder)
    end
  end

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
    controller = "/#{controller}" unless controller.blank? || controller.to_s[0] == ?/
    controller_sym = controller.try(:parameterize,'_').try(:to_sym)
    controller_name = controller.try(:split,'/').try(:last).try(:downcase)
    controller_name_class = (controller_name.nil?) ? '' : "nav_#{controller_name}"
    url =  settings[:url] || {:controller=>controller, :action=>action}
    text = settings[:text] || controller_name.try(:humanize)
    css_class = (settings[:css_class].nil?) ? '' : "nav_#{settings[:css_class]}"
    wrapper = settings[:wrapper]
    icon = settings[:icon]

    # Check permissions
    if controller.blank? || permitted_to?(action, controller_sym)

      # HTML element classes
      classes = [controller_name_class, action, css_class]
      classes << 'active' if self.controller.controller_name == controller_name
      class_attr_val = classes.join(' ')

      # Link tag
      link = link_to(text, url, 'data-remote' => settings[:remote])

      # Optional wrapper
      content = icon ? content_tag('i', nil, class: "#{icon} icon-2x") + link : link
      wrapper ? content_tag(wrapper, content, class: class_attr_val) : link
    end
  end
end
