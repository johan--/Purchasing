authorization do

  role :developer do
    includes :admin
    has_permission_on :authorization_rules, :to => :read
    has_permission_on :authorization_usages, :to => :read
  end

  role :admin do
    has_omnipotence

    includes :manager
  end

  role :manager do
    has_permission_on [:vendors, :accounts, :users] do
      to :manage
    end

    has_permission_on [:purchases, :notes, :line_items] do
      to :manage
    end

    has_permission_on [:receivings] do
      to :manage
    end

    has_permission_on [:tags, :canned_messages] do
      to :manage
    end

    includes :buyer
    includes :receiver
  end

  role :buyer do
    has_permission_on [:attachments, :vendors, :purchases, :line_items, :notes, :purchase_to_tags] do
      to :manage
    end

    has_permission_on [:purchases] do
      to :reconcile
      to :assign
      to :email_purchase
    end

    has_permission_on [:receivings, :receiving_lines, :search] do
      to :read
    end

    has_permission_on [:tags, :canned_messages, :accounts] do
      to :manage
    end

    has_permission_on [:users] do
      to :read
      to :tokens
      to :account_tokens
    end

    includes :employee
  end

  role :receiver do
    has_permission_on [:vendors, :accounts, :purchases, :line_items, :attachments,
                       :tags, :canned_messages, :purchase_to_tags, :users, :buyers, :search] do
      to :read
    end

    has_permission_on :notes do
      to :manage
    end

    has_permission_on [:receivings, :receiving_lines] do
      to :receive
      to :manage
    end

    includes :employee
  end

  role :employee do
    has_permission_on [:vendors, :accounts, :purchases, :line_items, :receivings, :receiving_lines, :tags, :purchase_to_tags] do
      to :read
      #if_attribute :requester => is {user}
    end

    includes :guest
  end

  role :guest do
    has_permission_on :users do
      to :stop_impersonating
      to :impersonate # Authorization is done inside the method
    end
  end

end

privileges do
  privilege :create,        :includes => :new
  privilege :read,          :includes => [:index, :show]
  privilege :update,        :includes => :edit
  privilege :delete,        :includes => [:destroy, :destroy_all, :cancel]
  privilege :receive,       :includes => :receive_all
  privilege :manage,        :includes => [:create, :read, :update, :delete, :tokens]
  privilege :reconcile,     :includes => :reconcile
end
