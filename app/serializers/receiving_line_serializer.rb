
class ReceivingLineSerializer < BaseSerializer

  attributes :id, :quantity, :last_user, :created_at, :updated_at, :line_item_id,
             :receiving_id

end
