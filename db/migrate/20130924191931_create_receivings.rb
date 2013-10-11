class CreateReceivings < ActiveRecord::Migration
  def change
    create_table :receivings do |t|
      t.references :purchase, index: true
      t.integer :total

      t.string :last_user
      t.timestamps
    end
  end
end
