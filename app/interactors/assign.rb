
class Assign
  include Interactor

  def perform
    context[:errors] = []

    if !ids.is_a? Array
      context[:errors].push 'Bad formatting'
      context.fail!
    end

    purchases = [Purchase.find(ids)].flatten
    context[:purchase] = purchases.first
    context[:errors]

    purchases.each do |purchase|
      if !user_id.blank? && !purchase.buyer.nil?
        context[:errors].push 'A buyer already exists'
      else
        context[:errors].push purchase.errors unless purchase.update(buyer_id: user_id)
      end

      context.fail! unless context[:errors].empty?
    end
  end

end
