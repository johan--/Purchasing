require 'spec_helper'
include Authorization::TestHelper

shared_examples "a CRUD controller" do |roles, new_attributes, except = []|

  # Permissions are:
  # - All
  # - Create
  # - Edit
  # - Read
  # - None

  if new_attributes.is_a? Hash
    new_object = Proc.new { new_attributes }
  elsif new_attributes.is_a? Proc
    new_object = new_attributes
  end

  let(:controller) { described_class }
  let(:model_name_camelized) { controller.name.gsub('sController','').to_sym }
  let(:model_name_underscored) { model_name_camelized.to_s.underscore.to_sym   }
  let(:model_class) { model_name_camelized.to_s.constantize }

  roles.each do |role, permission|

    describe "- Each CRUD method for #{role}" do
      let!(:user) do
        without_access_control do
          FactoryGirl.create(role)
        end
      end
      let!(:record) do
        without_access_control do
          model_class.destroy_all
          FactoryGirl.create(model_name_underscored)
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
          get :show, id: record.id
          if permission != :none
            expect(response).to be_success
          else
            expect(response).to_not be_success
          end
        end
      end

      unless except.include? :create
        it "- POST :create should be #{permission}" do
          post :create, model_name_underscored => new_object.call

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
          new_hash = { id: record.id }
          new_attributes = new_object.call(new_hash)

          patch :update, id: record.id, model_name_underscored => new_attributes

          if permission == :all || permission == :create || permission == :update
            expect(response).to be_success
            expect(response.content_type).to eq('application/json')
            expect(JSON.parse(response.body)[model_name_underscored.to_s]).to_not be_nil

            record.reload
            expect(record.send(new_attributes.keys[0])).to eq(new_attributes.values[0])
          else
            expect(response).to_not be_success
          end
        end
      end

      unless except.include? :destroy
        it "- DELETE :destroy should be #{permission}" do
          delete :destroy, id: record.id
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
