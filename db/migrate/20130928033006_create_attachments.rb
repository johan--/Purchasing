class CreateAttachments < ActiveRecord::Migration
  def change
    create_table :attachments do |t|
      t.references :purchase, index: true

      t.attachment :attachment 

      t.string :last_user
      t.timestamps
    end
  end
end
