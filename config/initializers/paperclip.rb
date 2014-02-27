
Paperclip.options[:command_path] = 'C:/Program Files/ImageMagick/'

Paperclip::Attachment.default_options[:styles] = { preview: ["1320x960>", :png], thumb: ["132x174>", :png] }
Paperclip::Attachment.default_options[:url] = "#{ENV['RAILS_RELATIVE_URL_ROOT'] }/attachments/:id.:style.:extension"
Paperclip::Attachment.default_options[:path] = ":rails_root/public/attachments/:id.:style.:extension"
