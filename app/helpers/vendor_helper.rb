module VendorHelper

  def get_as_url(url)
    prefix = (url.include? '@') ? 'mailto://' : 'http://'
    "#{prefix}#{url}"
  end

end
