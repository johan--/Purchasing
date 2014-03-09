require 'spec_helper'

describe TagsController do

  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :all,
                                         receiver: :none,
                                         employee: :none,
                                         guest: :none
                                       },
                                       { name: 'Test Tag' },
                                       [:show]
end
