require 'spec_helper'
include AuthenticationHelpers

describe TagsController do
  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :all,
                                         receiver: :read,
                                         employee: :read,
                                         guest: :none
                                       },
                                       { name: 'Test Tag' },
                                       [:create, :show, :update]


  before (:each) do
    without_access_control do
      @tag = FactoryGirl.create(:tag)
    end
  end

  describe "- Update a list of records" do
    PERMISSIONS = [:manager, :admin, :buyer]
    before (:each) do
     without_access_control do
        @tag2 = FactoryGirl.create(:tag)
      end
    end

    ROLES.each do |role|
      context "- As #{role}" do
        before (:each) do
          without_access_control do
            user = FactoryGirl.create(role)
            set_current_user user
          end
        end

        # Setup tags
        # key = id, values = params
        # params = :name or :delete
        it '- Can update a tag' do
          @tag2.name = "You're it"
          tags = {@tag.id => { name: @tag.name }, @tag2.id => { name: @tag2.name }}

          patch :update, { tags: tags }
          if PERMISSIONS.include? role
            response.should be_success
            expect(@tag2.reload.name).to eq("You're it")
          else
            response.should_not be_success
          end
        end

        it '- Can delete a tag' do
          tags = {@tag.id => { name: @tag.name }, @tag2.id => { delete: 'true', name: @tag2.name }}

          patch :update, { tags: tags }
          if PERMISSIONS.include? role
            response.should be_success
            expect(Tag.find_by(id: @tag2.id)).to be_nil
          else
            response.should_not be_success
          end
        end

      end
    end
  end

  context "- Function tests" do
    without_access_control do
      before (:each) do
        set_current_user FactoryGirl.create(:admin)
      end

      # Delete a tag with a purchase
      it "- Cannot delete a tag with purchases" do
        purchase = FactoryGirl.create(:purchase)
        purchase.tags << @tag

        delete :destroy, id: @tag.id
        expect(response).to_not be_success
      end
    end
  end

end
