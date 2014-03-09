require 'spec_helper'

describe AccountsController do

  new_object = Proc.new do
    user = FactoryGirl.create(:user)

    { number: '101000-604150-71204', user_id: user.id }
  end

  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :all,
                                         receiver: :none,
                                         employee: :none,
                                         guest: :none
                                       },
                                       new_object,
                                       [:show]
end
