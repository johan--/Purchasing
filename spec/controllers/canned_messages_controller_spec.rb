require 'spec_helper'

describe CannedMessagesController do

  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :all,
                                         receiver: :read,
                                         employee: :none,
                                         guest: :none
                                       },
                                       { name: 'Test Message', subject: 'A subject', text: 'Some other things' },
                                       [:show]
end
