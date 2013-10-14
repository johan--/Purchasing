require 'spec_helper'
include AuthenticationHelpers

describe PurchasesController do

  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :all,
                                         receiver: :read,
                                         employee: :read,
                                         guest: :none
                                       },
                                       :tracking_num
  # Test stars

  # Test receive_all

  # Test pagination?

  # Test filtering?
end
