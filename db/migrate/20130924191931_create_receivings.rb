class CreateReceivings < ActiveRecord::Migration
  def change
    create_table :receivings do |t|
      t.references :purchase, index: true
      t.string :package_num
      t.date :package_date
      t.decimal :total_price, precision: 8, scale: 2

      t.string :last_user
      t.timestamps
    end
  end
end
