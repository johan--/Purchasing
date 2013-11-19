require 'spec_helper'
include AuthenticationHelpers

describe UsersController do

  describe '- It sends a JSON list of users' do
    before (:each) do
      without_access_control do
        @user = FactoryGirl.create(:user)
      end
    end

    PERMISSIONS = [:manager, :admin, :buyer]

    ROLES.each do |role|
      it '- As #{role}' do
        without_access_control do
          user = FactoryGirl.create(role)
          set_current_user user
        end

        get :token_request, { q: @user.name }
        if PERMISSIONS.include? role
          expect(response).to be_success
        else
          expect(response).to_not be_success
        end
      end
    end
  end

  describe '- Impersonation' do
    before(:each) do
      without_access_control do
        @developer = FactoryGirl.create(:developer)
        @receiver = FactoryGirl.create(:receiver)
        set_current_user @developer
      end
    end

    it '- Can impersonate a user if dev' do
      get :impersonate, id: @receiver.id
      expect(response).to redirect_to(root_path)
    end

    it '- Can not impersonate a user if not dev' do
      without_access_control do
        set_current_user @receiver
      end

      get :impersonate, id: @receiver.id
      expect(response.status).to eq(404)
    end

    it '- Can stop impersonating a user' do
      get :impersonate, id: @receiver.id
      expect(response).to redirect_to(root_path)

      get :stop_impersonating
      expect(response).to redirect_to(root_path)
    end

  end
end
