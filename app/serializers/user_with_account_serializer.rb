
class UserWithAccountSerializer <  UserSerializer

  embed:ids, include: true
  self.root = 'user'

  has_many :accounts, each_serializer: AccountSerializer

end
