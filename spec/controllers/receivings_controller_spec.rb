require 'spec_helper'
include AuthenticationHelpers

describe ReceivingsController do

  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :read,
                                         receiver: :all,
                                         employee: :read,
                                         guest: :none
                                       },
                                       { package_num: 'u210' },
                                       [:index, :show, :update, :destroy]
end
