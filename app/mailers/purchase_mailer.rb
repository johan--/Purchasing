
class PurchaseMailer < ActionMailer::Base
  default :from => Settings.email.from,
          :content_type => 'text/html'

  def purchase_email(purchase, to, name, cc, from, message, subject, attachment_names, include_purchase)
    # :to & :cc are string of emails comma separated

    @name = name
    @text = message
    @purchase = purchase
    @include_purchase = include_purchase

    if attachment_names
      attachment_names.each do |file_name|
        attachments[file_name] = File.read(file_name)
      end
    end

    mail(
      to: to,
      cc: cc,
      subject: subject,
      reply_to: from
    )
  end
end
