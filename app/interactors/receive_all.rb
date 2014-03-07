
class ReceiveAll
  include Interactor

  def perform
    context[:errors] = []

    purchase = Purchase.eager_receiving.find(id)

    received_items = false
    new_doc = nil

    Purchase.transaction do
      new_doc = purchase.receivings.new

      purchase.line_items.each do |line|
        items_left = line.remaining

        if items_left > 0
          received_items = true
          new_doc.receiving_lines.new(quantity: items_left, line_item_id: line.id)
        end

      end

      # Raise errors
      if !received_items
        context[:errors].push 'Unable to find items to receive'
        context.fail!
        rollback

      elsif !new_doc.save
        context[:errors].push "There was an error saving the receiving document: #{new_doc.errors.full_messages}"
        context.fail!
        rollback

      else
       context[:receiving] = new_doc

      end
    end
  end

  def rollback
    raise ActiveRecord::Rollback
  end
end
