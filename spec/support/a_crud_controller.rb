require 'spec_helper'
include Authorization::TestHelper

shared_examples "a CRUD controller" do |roles, new_object, except = {}|
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

      it "- GET :index should be #{permission}" do
        get :index
        if permission == :none
          expect(response).to_not be_success
        else
          expect(response).to be_success
        end
      end

      it "- POST :new should be #{permission}" do
        post :new
        if permission == :all || permission == :create
          expect(response).to be_success
        else
          expect(response).to_not be_success
        end
      end

      it '- POST :create' do
        post :create, id: record.id, model_name => { new_object => 'new_object' }
        if permission == :all || permission == :create
          expect(response.code.to_i).to be(302)
        else
          expect(response).to_not be_success
          expect(model_class.count).to eq(1)
        end
      end

      it '- GET :edit' do
        other_record = FactoryGirl.create(model_name)
        get :edit, id: record.id
        if permission == :none || permission == :read
          expect(response).to_not be_success
        else
          expect(response).to be_success
          expect(assigns[model_name].id).to eq(record.id)
          expect(record.reload.id).to_not eq(other_record.id)
        end
      end

      it '- PATCH :update' do
        patch :update, id: record.id, model_name => { id: record.id, new_object => 'updated_object' }
        if permission == :none || permission == :read
          expect(response).to_not be_success
        else
          expect(response.code.to_i).to be(302)
          expect(model_class.where("id = #{record.id} AND #{new_object} = 'updated_object'").length).to be(1)
        end
      end

      it '- DELETE :destroy' do
        delete :destroy, id: record.id
        if permission == :none || permission == :read
          expect(response).to_not be_success
        else
          expect(response.code.to_i).to be(302)
          expect(model_class.find_by(id: record.id)).to be_nil
        end
      end
    end
  end
end
