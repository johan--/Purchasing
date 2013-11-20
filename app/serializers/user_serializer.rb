class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :department, :email, :phone, :photo_url, :current_login_at,
             :last_login_at, :login_count

  def current_login_at
    format_date object.current_login_at
  end

  def last_login_at
    format_date object.last_login_at
  end

  def format_date(date)
    return if date.nil?
    date.strftime("%b %-d, %Y")
  end

end
