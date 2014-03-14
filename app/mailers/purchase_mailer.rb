
class PurchaseMailer < ActionMailer::Base
  default :from => Settings.email.from,
          :content_type => 'text/html'

  def purchase_email(purchase, params, current_user)
    # :to & :cc are string of emails comma separated

    @purchase = purchase
    @name = params[:name]
    @include_purchase = params[:include_purchase]
    @body = process_shortcuts params[:body]

    from = current_user.email
    to = params[:to]
    cc = params[:cc]
    subject = process_shortcuts params[:subject]
    attachment_ids = params[:attachments]
    attachments_array = Attachment.find(attachment_ids) unless attachment_ids.blank?

    if attachments_array
      attachments_array.each do |file|
        attachments[file.attachment_file_name] = File.read(file.path)
      end
    end

    mail(
      to: to,
      cc: cc,
      subject: subject,
      reply_to: from
    )
  end

  private

  def process_shortcuts(item)
    if item && item.is_a?(String)
      item.gsub!(/%vendor/i, @purchase.vendors.first.try(:name) || '')
      item.gsub!(/%name/i, @purchase.requester.try(:first_name) || '')
      item.gsub!(/%order_num/i, @purchase.try(:order_number) || '')
      item.gsub!(/%id/i, @purchase.id.to_s)
    end

    item
  end

end
