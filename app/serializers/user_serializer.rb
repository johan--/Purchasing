class UserSerializer < ActiveModel::Serializer
  embed:ids, include: true

  attributes :id, :name, :department, :email, :phone, :photo_url, :current_login_at,
             :last_login_at, :login_count

  has_many :accounts

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
