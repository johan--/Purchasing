
class BigUserSerializer < UserSerializer
  embed:ids, include: true

  self.root = 'user'

  attributes :number_accounts, :current_login_at, :last_login_at, :login_count

  has_many :accounts, serializer: BigAccountSerializer

  def current_login_at
    format_date object.current_login_at
  end

  def last_login_at
    format_date object.last_login_at
  end

  def number_accounts
    object.accounts.length
  end

  private

  def format_date(date)
    return if date.nil?
    date.strftime(Settings.app.dateString)
  end
end
