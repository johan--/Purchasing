
class BaseSerializer < ActiveModel::Serializer

  attributes :can_update, :can_create, :can_delete

  def can_update
    scope.permitted_to?(:update, { object: object })
  end

  def can_create
    scope.permitted_to?(:create, { object: object })
  end

  def can_delete
    scope.permitted_to?(:delete, { object: object })
  end
end
