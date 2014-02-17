
Dir["./app/assets/javascripts/templates/**/*.*"].each do |s|
    filename = s.gsub(/^.*templates/,'').gsub(/\/_/, '/').gsub(/^\//, '')

    #header = "%script{ type: 'text/x-handlebars', 'data-template-name' => '#{filename.split('.')[0]}' }"
    data = File.open(s) { |f| f.readlines.join() }

    new_filename = s.gsub('/_', '/').gsub('.html.haml', '.js.hbs.hamlbars')
    File.open(new_filename, 'w') {|f| f.write(data)}
    File.delete(s)
end
