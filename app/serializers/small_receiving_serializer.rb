
class SmallReceivingSerializer < BaseSerializer
  embed:ids, include: true

  attributes :id, :package_num, :package_date, :last_user, :created_at, :updated_at,
             :purchase_id, :total_price

  def package_date
    format_date object.package_date
  end

  def format_date(date)
    return if date.nil?
    date.strftime(Settings.app.dateString)
  end
end
