require 'spec_helper'

describe ReceivingsController do

  { manager: :all,
    buyer: :read,
    receiver: :all,
    employee: :read,
    guest: :none
  }.each do |role, permission|

    describe "- Each CRUD method for #{role}" do

      let!(:record) do
        without_access_control do
          Receiving.destroy_all
          ReceivingLine.destroy_all

          @purchase = FactoryGirl.create(:purchase_with_lines)
          line = @purchase.line_items.first

          FactoryGirl.create(:receiving_with_line, { quantity: 1, purchase_id: @purchase.id, line_item_id: line.id })

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

      it "- POST :create should be #{permission}" do
        post :create, :receiving => { package_num: '123', purchase_id: @purchase.id,
                                      receiving_lines_attributes:
                                        { '0' => { quantity: 1, id: '',
                                                   line_item_id: @purchase.line_items.first.id,
                                                   receiving_id: '' } } }

        if permission == :none || permission == :read
          expect(response).to_not be_success
        else
          expect(response).to be_success
        end
      end

      it "- PATCH :update should be #{permission}" do
        patch :update, id: record.id, :receiving => { package_num: '123' }

        if permission == :none || permission == :read
          expect(response).to_not be_success
        else
          expect(response).to be_success
          record.reload
          expect(record.package_num).to eq('123')
        end
      end


      it "- DELETE :destroy should be #{permission}" do
        delete :destroy, id: record.id, user: user

        if permission == :all || permission == :create
          expect(response).to be_success
          expect(Receiving.find_by(id: record.id)).to be_nil
        else
          expect(response).to_not be_success
        end
      end
    end
  end


  # If a permission matches a rule
  def is_allowed(permission, rule)
    return true if rule == :all
    return true if rule == :edit && ( permission == :update ||
                                      permission == :delete ||
                                      permission == :create )
    permission == rule
  end

  describe '- It accepts nested attributes' do
    let(:rules) { { receivings: {
                    manager: :all,
                    buyer: :read,
                    receiver: :edit,
                    employee: :read,
                    guest: :none
                  },
                  receiving_lines: {
                    manager: :all,
                    buyer: :read,
                    receiver: :edit,
                    employee: :read,
                    guest: :none
                  }
                } }

    ROLES.each do |role|
      [:receiving_lines].each do |attribute|

        describe "- Nested Attributes" do

          describe "- #{attribute} for #{role}" do
            let(:current_rule) { rules[attribute][role] }

            before(:each) do
              without_access_control do
                @purchase = FactoryGirl.create(:purchase_with_lines)
                @base_tag = "#{attribute}_attributes".to_sym

                case attribute
                when :receiving_lines
                  line_item1 = @purchase.line_items.first
                  line_item2 = @purchase.line_items.last

                  @receiving = FactoryGirl.create(:receiving_with_line, { quantity: line_item1.quantity,
                                                                          purchase_id: @purchase.id,
                                                                          line_item_id: line_item1.id })
                  @new_line = @receiving.receiving_lines.first

                  @current_object = { id: @new_line.id,
                                      quantity: @new_line.quantity,
                                      purchase_id: @purchase.id,
                                      line_item_id: line_item1.id }
                  @new_object =     { id: '',
                                      quantity: line_item2.quantity,
                                      purchase_id: @purchase.id,
                                      line_item_id: line_item2.id }
                  @updated_object = { id: @new_line.id ,
                                      quantity: line_item1.quantity - 1,
                                      purchase_id: @purchase.id,
                                      line_item_id: line_item1.id }

                  @test_object = @receiving.receiving_lines
                  @test_field = :quantity
                end

                set_current_user FactoryGirl.create(role)

              end
            end

            it "- When sending a new item" do
              next if @new_object.nil?
              payload = { @base_tag => { '0' => @new_object } }

              patch :update, id: @receiving.id, receiving: payload

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

              patch :update, id: @receiving.id, receiving: payload

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
              patch :update, id: @receiving.id, receiving: payload

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


  describe '- Returns @receiving' do
    before(:each) do
      without_access_control do
        @purchase = FactoryGirl.create(:purchase_with_lines)
        @receiving = FactoryGirl.create(:receiving_with_line)
        user = FactoryGirl.create(:admin)
        set_current_user user
      end
    end

    it '- :update' do
      patch :update, id: @receiving.id, :receiving => { package_num: '123' }

      json = JSON.parse response.body

      expect(json['receiving_lines']).to_not be_nil
      expect(json['receiving']).to_not be_nil
      expect(json['receivings']).to be_nil
      expect(json['purchase']).to be_nil
      expect(json['line_items']).to be_nil
      expect(json['vendors']).to be_nil
      expect(response).to be_success
    end

    it '- :create' do
      post :create, :receiving => { package_num: '123', purchase_id: @purchase.id,
                                    receiving_lines_attributes:
                                      { '0' => { quantity: 1, id: '',
                                                 line_item_id: @purchase.line_items.first.id,
                                                 receiving_id: '' } } }

      json = JSON.parse response.body

      expect(json['receiving_lines']).to_not be_nil
      expect(json['receiving']).to_not be_nil
      expect(json['receivings']).to be_nil
      expect(json['purchase']).to be_nil
      expect(json['line_items']).to be_nil
      expect(json['vendors']).to be_nil
      expect(response).to be_success
    end

  end
end
