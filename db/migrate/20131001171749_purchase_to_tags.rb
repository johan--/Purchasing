class PurchaseToTags < ActiveRecord::Migration
  def change
    create_table :purchase_to_tags do |t|
      t.references :purchase, index: true
      t.references :tag, index: true
    end
  end
end
