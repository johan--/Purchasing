authorization do

  role :developer do
    includes :admin
  end

  role :admin do
    #has_omnipotence
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

    has_permission_on [:tags] do
      to :manage
    end
    includes :buyer
    includes :receiver
  end

  role :buyer do
    has_permission_on :vendors do
      to :manage
    end

    has_permission_on [:attachments] do
      to :manage
      if_attribute :buyer => is {user}
    end

    has_permission_on [:purchases, :notes, :line_items] do
      to :read
      if_attribute :buyer => is_not {user}
    end

    has_permission_on [:purchases, :notes, :line_items] do
      to :manage
      if_attribute :buyer => is {user}
    end

    has_permission_on [:receivings, :receiving_lines, :buyers] do
      to :read
    end

    has_permission_on [:tags, :accounts] do
      to :manage
    end

    has_permission_on [:users] do
      to :request_token
    end

    has_permission_on [:search] do
      to :read
    end
  end

  role :receiver do
    has_permission_on [:vendors, :accounts] do
      to :read
    end

    has_permission_on [:purchases, :line_items, :notes] do
      to :read
    end

    has_permission_on [:receivings, :receiving_lines] do
      to :receive
      to :manage
    end

    has_permission_on [:tags, :users, :buyers] do
      to :read
    end

    has_permission_on [:search] do
      to :read
    end
  end

  role :employee do
    has_permission_on [:vendors, :accounts, :purchases] do
      to :read
    end
  end

  role :guest do
  end

end

privileges do
  privilege :create, :includes => :new
  privilege :read, :includes => :index
  privilege :update, :includes => [:edit, :update_star]
  privilege :delete, :includes => :destroy
  privilege :receive, :includes => :receive_all
  privilege :request_token, :includes => [:read, :token_request]
  privilege :manage, :includes => [:create, :read, :update, :delete, :request_token]
end
