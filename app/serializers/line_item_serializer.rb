
class LineItemSerializer < BaseSerializer
  embed:ids

  attributes :id, :sku, :description, :unit, :quantity, :price, :purchase_id, :received_count_server

  has_many :receiving_lines

  def received_count_server
    return object.total_received
  end
end
