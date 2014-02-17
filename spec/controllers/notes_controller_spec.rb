require 'spec_helper'

describe NotesController do

  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :all,
                                         receiver: :read,
                                         employee: :read,
                                         guest: :none
                                       },
                                       { text: 'Test Note' },
                                       [:index, :show]
end
