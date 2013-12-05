require 'spec_helper'

#ActiveRecord::Base.logger = Logger.new(STDOUT) if defined?(ActiveRecord::Base)

describe PurchasesController do

  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :all,
                                         receiver: :read,
                                         employee: :read,
                                         guest: :none
                                       },
                                       { tracking_num: '1Z12351jfwdadq2vad2' }

  # Test receive_all

  # Test pagination?

  # Test filtering?

  # If a permission matches a rule
  def is_allowed(permission, rule)
    return true if rule == :all
    return true if rule == :edit && ( permission == :update ||
                                      permission == :delete ||
                                      permission == :create )
    permission == rule
  end

  describe '- It accepts nested attributes' do
    let(:rules) { { line_items: {
                      manager: :all,
                      buyer: :edit,
                      receiver: :read,
                      employee: :read,
                      guest: :none
                    },
                    tags: {
                      manager: :all,
                      buyer: :edit,
                      receiver: :read,
                      employee: :read,
                      guest: :none
                    },
                    notes: {
                      manager: :all,
                      buyer: :edit,
                      receiver: :read,
                      employee: :read,
                      guest: :none
                    },
                    attachments: {
                      manager: :all,
                      buyer: :edit,
                      receiver: :read,
                      employee: :read,
                      guest: :none
                    },
                  } }
    ROLES.each do |role|
      [:line_items, :tags, :notes].each do |attribute|

        describe "- Nested Attributes" do

          describe "- #{attribute} for #{role}" do
            let(:current_rule) { rules[attribute][role] }

            before(:each) do
              without_access_control do
                @purchase = FactoryGirl.create(:purchase)
                @base_tag = "#{attribute}_attributes".to_sym

                case attribute
                when :line_items
                  @new_line = FactoryGirl.create(:line_item)
                  @purchase.line_items << @new_line

                  @current_object = { id: @new_line.id,
                                      description: @new_line.description,
                                      quantity: @new_line.quantity }
                  @new_object =     { id: '',
                                      description: 'a new line item',
                                      quantity: 52 }
                  @updated_object = { id: @new_line.id,
                                      description: 'an updated line item',
                                      quantity: 25 }
                  @test_object = @purchase.line_items
                  @test_field = :description

                when :tags
                  @tag2 = FactoryGirl.create(:tag) # The creation order here is important for :create
                  @tag1 = FactoryGirl.create(:tag)
                  @new_line = PurchaseToTag.create(purchase_id: @purchase.id, tag_id: @tag1.id)

                  @current_object = { id: @new_line.id,
                                      tag_id: @tag1.id,
                                      name: @tag1.name }
                  @new_object =     { id: '',
                                      tag_id: @tag2.id,
                                      name: @tag2.name }
                  # Not allowed to update through nested attributes
                  @updated_object = nil
                  @test_object = @purchase.tags
                  @test_field = :name
                  @base_tag = :purchase_to_tags_attributes

                when :notes
                  @new_line = FactoryGirl.create(:note)
                  @purchase.notes << @new_line

                  @current_object = { id: @new_line.id,
                                      text: @new_line.text }
                  @new_object =     { id: '',
                                      text: 'a new note' }
                  @updated_object = { id: @new_line.id ,
                                      text: 'a test note' }
                  @test_object = @purchase.notes
                  @test_field = :text

                when :attachments

                end

                set_current_user FactoryGirl.create(role)

              end
            end

            it "- When sending a new item" do
              next if @new_object.nil?
              payload = { @base_tag => { '0' => @new_object } }

              patch :update, id: @purchase.id, purchase: payload

              if is_allowed(:create, current_rule)
                expect(response).to be_success
                @test_object.reload
                expect(@test_object.length).to eq(2)
                # This is a bad way to test the new object!
                expect(@test_object.last[@test_field]).to eq(@new_object[@test_field])
              else
                expect(response).to_not be_success
              end

            end

            it "- When updating an item" do
              next if @updated_object.nil?
              payload = { @base_tag => { '0' => @updated_object } }

              patch :update, id: @purchase.id, purchase: payload

              if is_allowed(:update, current_rule)
                expect(response).to be_success
                @test_object.reload
                expect(@test_object.length).to eq(1)
                expect(@test_object.last[@test_field]).to eq(@updated_object[@test_field])
              else
                expect(response).to_not be_success
              end

            end

            it "- When deleting an item it should be" do
              payload = { @base_tag => { '0' => { _destroy: true, id: @new_line.id } } }
              patch :update, id: @purchase.id, purchase: payload

              if is_allowed(:delete, current_rule)
                expect(response).to be_success
                @test_object.reload
                expect(@test_object.length).to eq(0)
              else
                expect(response).to_not be_success
              end

            end
          end
        end
      end
    end
  end

  describe '- It ignores blank records' do
    it '- For a note' do
    end
    it '- For a line item' do
    end
  end

  describe '- It allows validations to bubble' do
    describe '- For a line item' do
      it '- Quantity' do
      end

      it '- Description' do
      end
    end

  end

  ROLES.each do |role|
    describe "- It can reconcile records for #{role}" do

      let(:user) { FactoryGirl.create(role) }

      before(:each) do
        without_access_control do
          set_current_user user
          @purchase1 = FactoryGirl.create(:purchase)
          @purchase2 = FactoryGirl.create(:purchase)
        end
      end

      it '- Can reconcile multiple records' do
        without_access_control do
        end

        get :reconcile, { ids: [ @purchase1.id, @purchase2.id] }

        if (role == :manager || role == :buyer)
          expect(response).to be_success
          expect(@purchase1.reload.date_reconciled).to_not be_nil
          expect(@purchase2.reload.date_reconciled).to_not be_nil
        else
          expect(response).to_not be_success
        end
      end

      it '- Will get an error message if a record cannot be reconciled' do


      end
    end
  end

  ROLES.each do |role|
    describe "- It can assign records for #{role}" do

      let(:user) { FactoryGirl.create(role) }

      before(:each) do
        without_access_control do
          set_current_user user
          @purchase1 = FactoryGirl.create(:purchase)
          @purchase2 = FactoryGirl.create(:purchase)
        end
      end

      it '- Can assign multiple records' do

        get :assign, { ids: [ @purchase1.id, @purchase2.id], user_id: user.id }

        if (role == :manager || role == :buyer)
          expect(response).to be_success
          expect(@purchase1.reload.buyer).to_not be_nil
          expect(@purchase2.reload.buyer).to_not be_nil
        else
          expect(response).to_not be_success
        end
      end

      it '- Will get an error message if there is already a buyer' do
        without_access_control do
          @purchase1.update(buyer: user)
        end

        get :assign, { ids: [ @purchase1.id], user_id: user.id }
        expect(response).to_not be_success

      end
    end
  end

  # Test stars
  describe 'it toggles the star' do
    before (:each) do
      without_access_control do
        @record = FactoryGirl.create(:purchase)
      end
    end

    context '- Can toggle the Star' do
      before (:each) do
        set_current_user FactoryGirl.create(:admin)
      end

      it '- Toggles True to False' do
        @record.toggle_starred
        post :toggle_starred, id: @record.id
        expect(response).to be_success
        expect(@record.reload.starred).to be_nil
      end

      it '- Toggles False to True' do
        # Default is false so don't toggle
        post :toggle_starred, id: @record.id
        expect(response).to be_success
        expect(@record.reload.starred).to_not be_nil
      end
    end

    describe '- Fails if not authorized' do
      it '- Fails with :receiver' do
        set_current_user FactoryGirl.create(:receiver)
        post :toggle_starred, id: @record.id
        expect(response).to_not be_success
      end

      it '- Fails with :employee' do
        set_current_user FactoryGirl.create(:employee)
        post :toggle_starred, id: @record.id
        expect(response).to_not be_success
      end
    end
  end

  ROLES.each do |role|
    let(:allowed) { [:manager, :admin, :buyer] }

    describe "- Can send emails for #{role}" do

      describe '- Will send an email based on params' do
        before(:each) do
          without_access_control do
            @purchase = FactoryGirl.create(:purchase)
            @user = FactoryGirl.create(role)
            set_current_user @user
          end
        end

        it '- Can send the subject' do
          post :email_purchase, id: @purchase.id, message: 'A test Message', to: 'test@test.com', subject: 'A test subject'
          email = ActionMailer::Base.deliveries.last

          if !allowed.include? role
            expect(response).not_to be_success
          else
            expect(response).to be_success
            expect(email.subject).to eq('A test subject')
          end
        end

        it '- Can send the body' do
          post :email_purchase, id: @purchase.id, message: 'A test Message', to: 'test@test.com', subject: 'A test subject'
          email = ActionMailer::Base.deliveries.last

          if !allowed.include? role
            expect(response).not_to be_success
          else
            expect(response).to be_success
            expect(email.body.encoded).to include('A test Message')
          end
        end

        it '- Will fail without a body' do
          post :email_purchase, id: @purchase.id, message: nil, to: 'test@test.com', subject: 'A test subject'
          email = ActionMailer::Base.deliveries.last

          expect(response).not_to be_success
        end

        it '- Will fail without a TO' do
          post :email_purchase, id: @purchase.id, message: 'A test Message', to: nil, subject: 'A test subject'
          email = ActionMailer::Base.deliveries.last

          expect(response).not_to be_success
        end

        it '- Can send based on to param' do
          post :email_purchase, id: @purchase.id, message: 'A test Message', to: 'test@test.com', subject: 'A test subject'
          email = ActionMailer::Base.deliveries.last

          if !allowed.include? role
            expect(response).not_to be_success
          else
            expect(response).to be_success
            expect(email.to).to include('test@test.com')
          end
        end

        it '- Defaults to requester.email' do
          requester = nil
          without_access_control do
            requester = FactoryGirl.create(:user)
            @purchase.update(requester: requester)
          end

          post :email_purchase, id: @purchase.id, message: 'A test Message', subject: 'A test subject'
          email = ActionMailer::Base.deliveries.last

          if !allowed.include? role
            expect(response).not_to be_success
          else
            expect(response).to be_success
            expect(email.to).to include(requester.email)
          end
        end

        it '- Can send CC' do
          post :email_purchase, id: @purchase.id, message: 'A test Message', to: 'test@test.com', to: 'test2@test.com', subject: 'A test subject'
          email = ActionMailer::Base.deliveries.last

          if !allowed.include? role
            expect(response).not_to be_success
          else
            expect(response).to be_success
            expect(email.to).to include('test2@test.com')
          end
        end
      end

      describe '- It can send attachments' do
        #NYI
      end
    end
  end
end
