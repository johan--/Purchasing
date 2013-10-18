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
  let(:model_name) { controller.name.gsub('sController','').downcase.to_sym   }
  let(:model_class) { model_name.to_s.classify.constantize }

  roles.each do |role, permission|

    describe "- Each CRUD method for #{role}" do
      let!(:record) do
        model_class.destroy_all
        FactoryGirl.create(model_name)
      end

      before (:each) do
        set_current_user FactoryGirl.create(role)
      end

      unless except.include? :index
        it "- GET :index should be #{permission}" do
          get :index
          if permission == :none
            expect(response).to_not be_success
          else
            expect(response).to be_success
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
          post :create, id: record.id, model_name => new_object
          if permission == :all || permission == :create
            expect(response).to be_success
          else
            expect(response).to_not be_success
            expect(model_class.count).to eq(1)
          end
        end
      end

      unless except.include? :update
        it "- PATCH :update should be #{permission}" do
          patch :update, id: record.id, model_name => { id: record.id }.merge(new_object)
          if permission == :none || permission == :read
            expect(response).to_not be_success
          else
            expect(response).to be_success
            record.reload
            expect(record.send(new_object.keys[0])).to eq(new_object.values[0])
          end
        end
      end

      unless except.include? :destroy
        it "- DELETE :destroy should be #{permission}" do
          delete :destroy, id: record.id
          if permission == :none || permission == :read
            expect(response).to_not be_success
          else
            expect(response).to be_success
            expect(model_class.find_by(id: record.id)).to be_nil
          end
        end
      end

    end
  end
end
