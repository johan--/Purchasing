class CreateAttachments < ActiveRecord::Migration
  def change
    create_table :attachments do |t|
      t.references :purchase, index: true
      t.references :user, index: true

      t.attachment :attachment
      t.string :category

      t.timestamps
    end
  end
end
