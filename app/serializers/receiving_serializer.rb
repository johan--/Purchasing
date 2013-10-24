class ReceivingSerializer < ActiveModel::Serializer
  embed:ids, include: true

  attributes :id, :package_num, :package_date, :last_user, :total, :created_at, :updated_at
  has_many :receiving_lines
end
