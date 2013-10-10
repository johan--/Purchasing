class CreatePurchases < ActiveRecord::Migration
  def change
    create_table :purchases do |t|
      t.references :buyer, index: true
      t.references :requester, index: true
      t.references :account, index: true

      t.string :tracking_num, index: true
      t.string :approved_by
      t.date :date_approved
      t.date :date_requested, index: true
      t.date :date_purchased, index: true
      t.date :date_expected, index: true
      t.date :date_required, index: true
      t.date :date_received, index: true
      t.date :date_reconciled, index: true
      t.date :starred, index:true

      t.string :last_user
      t.timestamps
    end
  end
end
