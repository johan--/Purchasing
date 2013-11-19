require 'spec_helper'
include AuthenticationHelpers

describe AccountsController do

  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :all,
                                         receiver: :read,
                                         employee: :read,
                                         guest: :none
                                       },
                                       { number: '101000-604150-71204' }
end
