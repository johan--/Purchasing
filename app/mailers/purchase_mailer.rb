class PurchaseMailer < ActionMailer::Base

  def purchase_email(purchase, to, name, cc, message, subject, attachment_names) # :to & :cc are string of emails comma separated
    @name = name
    @text = message
    @purchase = purchase

    if attachment_names
      attachment_names.each do |file_name|
        attachments[file_name] = File.read(file_name)
      end
    end

    mail(
      to: to,
      cc: cc,
      subject: subject,
      from: current_user.email
    )
  end

end
