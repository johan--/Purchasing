
require 'wicked_pdf'

WickedPdf.config = {
  exe_path: Settings.local_urls.wicked_pdf,
  page_size: 'Letter',
  orientation: 'Landscape',
  disable_internal_links: true,
  disable_external_links: true,
  disable_javascript: true,
  no_background: false
}

Purchasing::Application.config.middleware.use WickedPdf::Middleware, {}, only: '/api/1.0/purchases'
