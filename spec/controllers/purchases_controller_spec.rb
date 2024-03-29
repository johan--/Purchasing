require 'spec_helper'
require 'json'

#ActiveRecord::Base.logger = Logger.new(STDOUT) if defined?(ActiveRecord::Base)

describe PurchasesController do

  new_object = Proc.new do
    requester = vendor = nil

    without_access_control do
      requester = FactoryGirl.create(:user)
      vendor = FactoryGirl.create(:vendor)
    end

    { tracking_num: '1Z12351jfwdadq2vad2',
      date_requested: '1/1/2014',
      vendors: [vendor.id],
      requester: requester.id,
      purchase_type: 'materials' }
  end

  it_behaves_like 'a CRUD controller', { manager: :all,
                                         buyer: :all,
                                         receiver: :read,
                                         employee: :read,
                                         guest: :none
                                       }, new_object


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
                    attachments: {
                      manager: :all,
                      buyer: :edit,
                      receiver: :read,
                      employee: :read,
                      guest: :none
                    },
                  } }
    ROLES.each do |role|
      [:line_items, :tags].each do |attribute|

        describe '- Nested Attributes' do

          describe "- #{attribute} for #{role}" do
            let(:current_rule) { rules[attribute][role] }

            before(:each) do
              without_access_control do
                @purchase = FactoryGirl.create(:purchase)

                requester = FactoryGirl.create(:employee)
                vendor = FactoryGirl.create(:vendor)
                @base_new_object = { requester: requester.id, vendors: [vendor.id] }

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

            it '- When sending a new item' do
              next if @new_object.nil?
              payload = { @base_tag => { '0' => @new_object } }

              patch :update, id: @purchase.id, purchase: payload

              if is_allowed(:create, current_rule)
                expect(response).to be_success
                @test_object.reload

                test_array = @test_object.to_a
                expect(test_array.length).to eq(2)

                filtered_array = test_array.select{ |item| item[@test_field] == @new_object[@test_field] }
                expect(filtered_array.length).to eq(1)
              else
                expect(response).to_not be_success
              end

            end

            it '- When updating an item' do
              next if @updated_object.nil?
              payload = { @base_tag => { '0' => @updated_object } }

              patch :update, id: @purchase.id, purchase: payload

              if is_allowed(:update, current_rule)
                expect(response).to be_success
                @test_object.reload

                expect(@test_object.length).to eq(1)
                expect(@test_object.first[@test_field]).to eq(@updated_object[@test_field])
              else
                expect(response).to_not be_success
              end

            end

            it '- When deleting an item it should be' do
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

            it '- When creating a new Purchase and creating a new item' do
              payload = { date_requested: '1/1/2014', purchase_type: 'materials',
                          @base_tag => { '0' => @new_object } }.merge(@base_new_object)
              post :create, purchase: payload

              if is_allowed(:create, current_rule)
                expect(response).to be_success
                expect(response.content_type).to eq('application/json')
                expect(JSON.parse(response.body)['purchase']).to_not be_nil
              else
                expect(response).to_not be_success
              end
            end
          end
        end
      end
    end
  end

  # Reconciling
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

      it '- Can reconcile a single record' do
        get :reconcile, { ids: @purchase1.id, value: true }

        if (role == :manager || role == :buyer)
          expect(response).to be_success
          expect(@purchase1.reload.date_reconciled).to_not be_nil
        else
          expect(response).to_not be_success
        end
      end

      it '- Can reconcile multiple records' do
        get :reconcile, { ids: [ @purchase1.id, @purchase2.id], value: true }

        if (role == :manager || role == :buyer)
          expect(response).to be_success
          expect(@purchase1.reload.date_reconciled).to_not be_nil
          expect(@purchase2.reload.date_reconciled).to_not be_nil
        else
          expect(response).to_not be_success
        end
      end

      it '- Cannot reconcile a canceled record' do
        without_access_control do
          @purchase1.update(date_purchased: Time.now, date_canceled: Time.now)
        end
        get :reconcile, { ids: @purchase1.id, value: true }

        expect(response).to_not be_success
      end

      it '- Can unreconcile multiple records' do
        without_access_control do
          @purchase1.update(date_reconciled: Time.now)
          @purchase2.update(date_reconciled: Time.now)
        end
        get :reconcile, { ids: [ @purchase1.id, @purchase2.id], value: false }

        if (role == :manager || role == :buyer)
          expect(response).to be_success
          expect(@purchase1.reload.date_reconciled).to be_nil
          expect(@purchase2.reload.date_reconciled).to be_nil
        else
          expect(response).to_not be_success
        end
      end

      it '- Can unreconcile one record' do
        without_access_control do
          @purchase1.update(date_reconciled: Time.now)
        end
        get :reconcile, { ids: @purchase1.id, value: false }

        if (role == :manager || role == :buyer)
          expect(response).to be_success
          expect(@purchase1.reload.date_reconciled).to be_nil
        else
          expect(response).to_not be_success
        end
      end
    end
  end

  # Assigning
  ROLES.each do |role|
    describe "- It can assign records for #{role}" do

      let(:buyer) { FactoryGirl.create(:buyer) }

      before(:each) do
        without_access_control do
          set_current_user FactoryGirl.create(role)
          @purchase1 = FactoryGirl.create(:purchase)
          @purchase2 = FactoryGirl.create(:purchase)
        end
      end

      it '- Can assign multiple records' do
        get :assign, { ids: [ @purchase1.id, @purchase2.id], user_id: buyer.id }

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
          @purchase1.update(buyer: buyer)
        end

        get :assign, { ids: [@purchase1.id], user_id: buyer.id }
        expect(response).to_not be_success
      end

      it '- Will unassign if no buyer is sent' do
        without_access_control do
          @purchase1.update(buyer: buyer)
        end

        get :assign, { ids: [@purchase1.id], user_id: nil }

        if (role == :manager || role == :buyer)
          expect(response).to be_success
          expect(@purchase1.reload.buyer).to be_nil
        else
          expect(response).to_not be_success
        end
      end

      it '- Will fail if buyer is not found' do
        get :assign, { ids: [@purchase1.id], user_id: buyer.id + 10 }
        expect(response).to_not be_success
      end

      it '- Will fail if the sent user is not a buyer' do
        without_access_control do
          @non_buyer = FactoryGirl.create(:receiver)
        end

        get :assign, { ids: [@purchase1.id], user_id: @non_buyer.id }
        expect(response).to_not be_success
      end

      it '- Returns an error if an array isnt sent' do
        get :assign, { ids: @purchase1.id, user_id: buyer.id }
        expect(response).to_not be_success
      end
    end
  end

  # Email
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
          post :email_purchase, id: @purchase.id, body: 'A test Message', to: 'test@test.com', subject: 'A test subject'
          email = ActionMailer::Base.deliveries.last

          if !allowed.include? role
            expect(response).not_to be_success
          else
            expect(response).to be_success
            expect(email.subject).to eq('A test subject')
          end
        end

        it '- Can send the body' do
          post :email_purchase, id: @purchase.id, body: 'A test Message', to: 'test@test.com', subject: 'A test subject'
          email = ActionMailer::Base.deliveries.last

          if !allowed.include? role
            expect(response).not_to be_success
          else
            expect(response).to be_success
            expect(email.body.encoded).to include('A test Message')
          end
        end

        it '- Will fail without a body' do
          post :email_purchase, id: @purchase.id, body: nil, to: 'test@test.com', subject: 'A test subject'
          email = ActionMailer::Base.deliveries.last

          expect(response).not_to be_success
        end

        it '- Will fail without a TO' do
          post :email_purchase, id: @purchase.id, body: 'A test Message', to: nil, subject: 'A test subject'
          email = ActionMailer::Base.deliveries.last

          expect(response).not_to be_success
        end

        it '- Can send based on to param' do
          post :email_purchase, id: @purchase.id, body: 'A test Message', to: 'test@test.com', subject: 'A test subject'
          email = ActionMailer::Base.deliveries.last

          if !allowed.include? role
            expect(response).not_to be_success
          else
            expect(response).to be_success
            expect(email.to).to include('test@test.com')
          end
        end

        it '- Can send CC' do
          post :email_purchase, id: @purchase.id, body: 'A test Message', to: 'test@test.com', cc: 'test2@test.com', subject: 'A test subject'
          email = ActionMailer::Base.deliveries.last

          if !allowed.include? role
            expect(response).not_to be_success
          else
            expect(response).to be_success
            expect(email.cc).to include('test2@test.com')
          end
        end
      end

      describe '- It can send attachments' do
        #NYI
      end
    end
  end

  describe '- Email helpers' do
    before(:each) do
      without_access_control do
        set_current_user FactoryGirl.create(:admin)
        @purchase = FactoryGirl.create(:purchase)
      end
    end

    it '- Converts %vendor' do
      str = 'A test string with %vendor'
      vendor = FactoryGirl.create(:vendor)
      @purchase.vendors << vendor

      post :email_purchase, id: @purchase.id, body: str,
                                              to: 'test@test.com',
                                              subject: 'A test subject'
      email = ActionMailer::Base.deliveries.last

      expect(email.body.encoded).to_not include('%vendor')
      expect(email.body.encoded).to include("A test string with #{vendor.name}")
    end

    it '- Converts %name' do
      str = 'A test string with %name'
      requester = FactoryGirl.create(:employee)
      @purchase.update(requester: requester)

      post :email_purchase, id: @purchase.id, body: str,
                                              to: 'test@test.com',
                                              subject: 'A test subject'
      email = ActionMailer::Base.deliveries.last

      expect(email.body.encoded).to_not include('%name')
      expect(email.body.encoded).to include("A test string with #{requester.first_name}")
    end

    it '- Converts %order_num' do
      str = 'A test string with %order_num'
      @purchase.update(order_number: '555444333')

      post :email_purchase, id: @purchase.id, body: str,
                                              to: 'test@test.com',
                                              subject: 'A test subject'
      email = ActionMailer::Base.deliveries.last

      expect(email.body.encoded).to_not include('%order_num')
      expect(email.body.encoded).to include("A test string with 555444333")
    end

    it '- Converts %id' do
      str = 'A test string with %id'

      post :email_purchase, id: @purchase.id, body: str,
                                              to: 'test@test.com',
                                              subject: 'A test subject'
      email = ActionMailer::Base.deliveries.last

      expect(email.body.encoded).to_not include('%id')
      expect(email.body.encoded).to include("A test string with #{@purchase.id}")
    end

    it '- Does not alter original' do
      str = 'A test string with no helpers'

      post :email_purchase, id: @purchase.id, body: str,
                                              to: 'test@test.com',
                                              subject: 'A test subject'
      email = ActionMailer::Base.deliveries.last

      expect(email.body.encoded).to include(str)
    end
  end

  describe '- Canned messages' do
    before(:each) do
      without_access_control do
        @purchase = FactoryGirl.create(:purchase)
        set_current_user FactoryGirl.create(:admin)
        @message = FactoryGirl.create(:canned_message)
      end
    end

    it '- Will return a note if a canned message type is sent' do
      str = 'A test string with no helpers'

      post :email_purchase, id: @purchase.id, body: str,
                                              to: 'test@test.com',
                                              subject: 'A test subject',
                                              canned_message: @message.name
      email = ActionMailer::Base.deliveries.last

      expect(response.body).to include(@message.note_text)
      expect(response.content_type).to eq('application/json')
    end
  end

  describe '- Receive All' do
    before(:each) do
      without_access_control do
        @purchase = FactoryGirl.create(:purchase_with_lines)
        user = FactoryGirl.create(:admin)
        set_current_user user
      end
    end

    it '- Returns @receiving' do
      post :receive_all, id: @purchase.id

      json = JSON.parse response.body

      expect(response.content_type).to eq('application/json')
      expect(json['receiving_lines']).to_not be_nil
      expect(json['receiving']).to_not be_nil
      expect(json['receivings']).to be_nil
      expect(json['purchase']).to be_nil
      expect(json['line_items']).to be_nil
      expect(json['vendors']).to be_nil
      expect(response).to be_success
    end

    it '- Flags purchase as received' do
      post :receive_all, id: @purchase.id

      expect(@purchase.reload.received).to be_true
    end

    it '- Returns the new Receiving Document' do
      post :receive_all, id: @purchase.id

      json = JSON.parse response.body

      expect(json['receiving']['id']).to eq(@purchase.receivings.last.id)
    end

    # Test errors?
  end

  describe '- Create with attachments' do
    before(:each) do
      without_access_control do
        @attachment1 = FactoryGirl.create(:attachment)
        @attachment2 = FactoryGirl.create(:attachment)
        @requester = FactoryGirl.create(:employee)

        set_current_user FactoryGirl.create(:admin)
      end
    end

    it '- If you send a single attachment' do
      post :create, :purchase => { date_requested: '1/1/2012',
                                   purchase_type: 'materials',
                                   requester: @requester.id,
                                   new_attachments: [@attachment1.id] }

      expect(response).to be_success
      expect(@attachment1.reload.purchase_id).to_not be_nil
      expect(@attachment1.category).to eq('Requisition')
      expect(@attachment2.reload.purchase_id).to be_nil
    end

    it '- If you send an array' do
      post :create, :purchase => { date_requested: '1/1/2012',
                                   purchase_type: 'materials',
                                   requester: @requester.id,
                                   new_attachments: [@attachment1.id, @attachment2.id] }

      expect(response).to be_success
      expect(@attachment1.reload.purchase_id).to_not be_nil
      expect(@attachment2.reload.purchase_id).to_not be_nil
      expect(@attachment1.category).to eq('Requisition')
      expect(@attachment2.category).to eq('Requisition')
    end
  end
end
