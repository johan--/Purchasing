require 'spec_helper'
include AuthenticationHelpers

describe AccountsController do

  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :all,
                                         receiver: :read,
                                         employee: :read,
                                         guest: :none
                                       },
                                       { number: '101000-604150-71204' },
                                       [:index, :create]

  # These methods should probably be moved to the User model

  # Index   (Must include a user)
  # Create  (Must include a user)

end
