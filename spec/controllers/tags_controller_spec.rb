require 'spec_helper'
include AuthenticationHelpers

describe TagsController do
  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :all,
                                         receiver: :read,
                                         employee: :read,
                                         guest: :none
                                       },
                                       { name: 'Test Tag' },
                                       [:create, :show, :update]

   # TODO: Update method

end
