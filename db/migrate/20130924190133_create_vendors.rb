class CreateVendors < ActiveRecord::Migration
  def change
    create_table :vendors do |t|
      t.string :name, index: true
      t.string :website, index: true
      t.string :email
      t.string :address, index: true
      t.string :city, index: true
      t.string :state, index: true
      t.string :zip_code
      t.string :country
      t.string :phone
      t.string :fax
      t.string :comments
      t.string :account_num, index: true
      t.timestamps
    end
  end
end
