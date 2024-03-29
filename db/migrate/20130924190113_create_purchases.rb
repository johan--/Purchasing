class CreatePurchases < ActiveRecord::Migration
  def change
    create_table :purchases do |t|
      t.references :buyer, index: true
      t.references :requester, index: true
      t.references :recipient, index: true
      t.references :account, index: true

      t.string :tracking_num, index: true
      t.string :courier
      t.string :approved_by
      t.string :order_number
      t.string :order_confirmation
      t.string :vendor_string
      t.string :purchase_type

      t.decimal :labor, precision: 8, scale: 2, default: 0.0
      t.decimal :shipping, precision: 8, scale: 2, default: 0.0
      t.decimal :tax_rate, precision: 8, scale: 4, default: 0.100

      t.date :date_approved
      t.date :date_requested, index: true
      t.date :date_required, index: true
      t.date :date_expected, index: true
      t.date :date_purchased, index: true
      t.date :date_reconciled, index: true
      t.date :date_posted, index: true
      t.date :date_canceled, index: true
      t.date :starred, index:true

      t.boolean :received, default: false
      t.string :last_user
      t.timestamps
    end
  end
end
