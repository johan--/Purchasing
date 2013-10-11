class CreatePurchaseToVendors < ActiveRecord::Migration
  def change
    create_table :purchase_to_vendors do |t|
      t.references :purchase, index: true
      t.references :vendor, index: true
    end
  end
end
