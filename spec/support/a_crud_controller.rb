require 'spec_helper'
include Authorization::TestHelper

shared_examples "a CRUD controller" do |roles, new_object, except = []|
  # Permissions are:
  # - All
  # - Create
  # - Edit
  # - Read
  # - None
  let(:controller) { described_class }
  let(:model_name_camelized) { controller.name.gsub('sController','').to_sym }
  let(:model_name_underscored) { model_name_camelized.to_s.underscore.to_sym   }
  let(:model_class) { model_name_camelized.to_s.constantize }

  roles.each do |role, permission|

    describe "- Each CRUD method for #{role}" do
      let!(:record) do
        without_access_control do
          model_class.destroy_all
          FactoryGirl.create(model_name_underscored)
        end
      end
      let!(:user) do
        without_access_control do
          FactoryGirl.create(role)
        end
      end

      before (:each) do
        without_access_control do
          set_current_user user
        end
      end

      unless except.include? :index
        it "- GET :index should be #{permission}" do
          get :index, user: user
          if permission == :none
            expect(response).to_not be_success
          else
            expect(response).to be_success
            expect(response.content_type).to eq('application/json')
            expect(JSON.parse(response.body)[model_name_underscored.to_s.pluralize]).to_not be_nil
          end
        end
      end

      unless except.include? :show
        it "- GET :show should be #{permission}" do
          get :show, id: record.id, user: user
          if permission != :none
            expect(response).to be_success
          else
            expect(response).to_not be_success
          end
        end
      end

      unless except.include? :create
        it "- POST :create should be #{permission}" do
          post :create, id: record.id, model_name_underscored => new_object.merge({ user_id: user })

          if permission == :all || permission == :create
            expect(response).to be_success
            expect(response.content_type).to eq('application/json')
            expect(JSON.parse(response.body)[model_name_underscored.to_s]).to_not be_nil
          else
            expect(response).to_not be_success
            expect(model_class.count).to eq(1)
          end
        end
      end

      unless except.include? :update
        it "- PATCH :update should be #{permission}" do
          patch :update, id: record.id, user: user, model_name_underscored => { id: record.id }.merge(new_object)
          if permission == :all || permission == :create || permission == :update
            expect(response).to be_success
            expect(response.content_type).to eq('application/json')
            expect(JSON.parse(response.body)[model_name_underscored.to_s]).to_not be_nil

            record.reload
            expect(record.send(new_object.keys[0])).to eq(new_object.values[0])
          else
            expect(response).to_not be_success
          end
        end
      end

      unless except.include? :destroy
        it "- DELETE :destroy should be #{permission}" do
          delete :destroy, id: record.id, user: user
          if permission == :all || permission == :create
            expect(response).to be_success
            expect(model_class.find_by(id: record.id)).to be_nil
            expect(response.content_type).to eq('application/json')
          else
            expect(response).to_not be_success
          end
        end
      end
    end
  end
end
