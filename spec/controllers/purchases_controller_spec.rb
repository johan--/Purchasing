require 'spec_helper'
include AuthenticationHelpers

describe PurchasesController do

  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :all,
                                         receiver: :read,
                                         employee: :read,
                                         guest: :none
                                       },
                                       { tracking_num: '1Z12351jfwdadq2vad2' }

  # TODO: Add 'New' to CRUD controller and test on Purchase

  # Test receive_all

  # Test pagination?

  # Test filtering?
end
