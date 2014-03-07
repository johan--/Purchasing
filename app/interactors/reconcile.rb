
class Reconcile
  include Interactor

  def perform
    context[:value] = true if context[:value].nil?
    context[:errors] = []

    purchases = Purchase.eager_lines.find([ids].flatten)
    purchases.each { |purchase| reconcile(purchase) }
  end

  private

  def reconcile(purchase)
    if purchase.date_canceled
      context[:errors].push 'Cannot reconcile a canceled record'
      context.fail!
    else
      update_val = (value == true || value == 'true') ? Time.now : nil
      # Use update_columns to bypass callbacks
      purchase.update_columns(date_reconciled: update_val)
    end
  end

end
