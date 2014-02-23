require 'spec_helper'

describe UsersController do

  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :read,
                                         receiver: :read,
                                         employee: :none,
                                         guest: :none
                                       },
                                       { package_num: 'u210' },
                                       [:show, :create, :update, :destroy]

  describe '- It sends a JSON list of users' do
    before (:each) do
      without_access_control do
        @user = FactoryGirl.create(:user)
      end
    end

    permissions = [:manager, :admin, :buyer]

    ROLES.each do |role|
      it "- As #{role}" do
        without_access_control do
          @role = FactoryGirl.create(role)
          set_current_user @role
        end

        get :tokens, { q: @user.name }
        if permissions.include? role
          expect(response).to be_success
          expect(response.body).to include(@user.name)
          expect(response.body).to_not include(@role.name)
        else
          expect(response).to_not be_success
        end
      end
    end
  end

  describe '- Impersonation' do
    permissions = [:admin]

    ROLES.each do |role|

      context "- As #{role}" do

        before(:each) do
          without_access_control do
            set_current_user FactoryGirl.create(role)
          end
        end

        it '- Starting impersonation' do
          get :impersonate, user_role: :receiver

          if permissions.include? role
            expect(response).to redirect_to(root_path)
          else
            expect(response).to_not be_success
          end
        end

        it '- Stopping impersonation' do
          get :impersonate, user_role: :receiver

          if permissions.include? role
            expect(response).to redirect_to(root_path)
          else
            expect(response).to_not be_success
          end
        end
      end
    end
  end

  describe 'Account Tokens' do

    permissions = [:manager, :admin, :buyer]

    ROLES.each do |role|

      context "- As #{role}" do

        before(:each) do
          set_current_user FactoryGirl.create(role)
        end

        it '- Will create a new user if none exists' do
          post :account_tokens, user: { netid: 'a_new_user' }

          if permissions.include? role
            expect(response).to be_success
            expect(User.last.username).to eq('a_new_user')
          else
            expect(response).to_not be_success
          end
        end

        it '- Will update a user if it exists' do
          user = FactoryGirl.create(:employee)
          post :account_tokens, user: { netid: user.username, title: 'an updated title' }

          if permissions.include? role
            expect(response).to be_success
            expect(user.reload.title).to eq('an updated title')
          else
            expect(response).to_not be_success
          end
        end

        it '- Will return both user and accounts' do
          user = FactoryGirl.create(:employee)
          post :account_tokens, user: { netid: user.username }

          if permissions.include? role
            response_json = JSON.parse(response.body)

            expect(response).to be_success
            expect(response.content_type).to eq('application/json')
            expect(response_json['user']).to_not be_nil
            expect(response_json['user']['id']).to_not be_nil
            expect(response_json['user']['name']).to_not be_nil
            expect(response_json['user']['displayname']).to_not be_nil
            expect(response_json['accounts']).to_not be_nil
          else
            expect(response).to_not be_success
          end
        end

        it '- Will render an error if no params are sent' do
          post :account_tokens

          expect(response).to_not be_success
        end

        it '- Will not replace existing vals with nil' do
          user = FactoryGirl.create(:employee, { department: 'test', phone: '1234', photo_url: 'test' })
          old_user = user.clone
          post :account_tokens, user: { netid: user.username, title: 'an updated title' }

          if permissions.include? role
            expect(response).to be_success
            expect(user.reload.title).to_not eq(old_user.title)
            expect(user.reload.email).to eq(old_user.email)
            expect(user.reload.department).to eq(old_user.department)
            expect(user.reload.phone).to eq(old_user.phone)
            expect(user.reload.photo_url).to eq(old_user.photo_url)
          else
            expect(response).to_not be_success
          end
        end
      end
    end
  end
end
