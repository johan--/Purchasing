
require 'wicked_pdf'

WickedPdf.config = {
  exe_path: 'c:\wkhtmltopdf\wkhtmltopdf.exe',
  page_size: 'Legal',
  orientation: 'Landscape',
  print_media_type: true,
  disable_internal_links: true,
  disable_external_links: true,
  disable_javascript: true
}

Purchasing::Application.config.middleware.use WickedPdf::Middleware, {}, only: '/purchases'
