authorization do

  role :developer do
    includes :admin
  end

  role :admin do
    has_omnipotence
    includes :manager
  end

  role :manager do
    has_permission_on [:vendors, :accounts, :users] do
      to :administrate
    end

    has_permission_on [:purchases, :notes, :line_items] do
      to :administrate
    end

    has_permission_on [:receivings] do
      to :administrate
    end

    has_permission_on [:tags] do
      to :administrate
    end

    includes :buyer
    includes :receiver
  end

  role :buyer do
    has_permission_on [:vendors, :accounts] do
      to :administrate
    end
 
    has_permission_on [:attachments] do
      to :administrate
      if_attribute :buyer => is {user}
    end
 
    has_permission_on [:purchases, :notes, :line_items] do
      to :read
      if_attribute :buyer => is_not {user}
    end

    has_permission_on [:purchases, :notes, :line_items] do
      to :administrate
      if_attribute :buyer => is {user}
    end

    has_permission_on [:receivings, :receiving_lines, :users, :requesters, :buyers] do
      to :read
    end

    has_permission_on [:tags] do
      to :administrate
    end
  
    has_permission_on [:requesters, :vendors] do
      to :request_token
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
      to :administrate
    end

    has_permission_on [:tags, :users, :requesters, :buyers] do
      to :read
    end
  end

  role :employee do
    includes :guest
  end

  role :guest do
  end

end

privileges do
  privilege :create, :includes => :new
  privilege :read, :includes => [:index, :show]
  privilege :update, :includes => [:edit, :update_star]
  privilege :receive, :includes => :receive_all
  privilege :delete, :includes => :destroy
  privilege :request_token, :includes => :token_request
  privilege :administrate, :includes => [:create, :read, :update, :delete]
end