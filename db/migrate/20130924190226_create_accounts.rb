class CreateAccounts < ActiveRecord::Migration
  def change
    create_table :accounts do |t|
      t.references :user, index: true

      t.integer :fund, index: true
      t.integer :org, index: true
      t.integer :acct, index: true

      t.timestamps
    end
  end
end
