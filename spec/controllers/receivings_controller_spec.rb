require 'spec_helper'
include AuthenticationHelpers

describe ReceivingsController do

  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :read,
                                         receiver: :all,
                                         employee: :read,
                                         guest: :none
                                       },
                                       { package_num: 'u210' },
                                       [:index, :show]


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
                @receiving = FactoryGirl.create(:receiving)
                @base_tag = "#{attribute}_attributes".to_sym

                case attribute
                when :receiving_lines
                  line_item1 = @purchase.line_items.first
                  line_item2 = @purchase.line_items.last

                  @new_line = FactoryGirl.create(:receiving_line, { quantity: line_item1.quantity,
                                                                    receiving_id: @receiving.id,
                                                                    line_item_id: line_item1.id })
                  @receiving.receiving_lines << @new_line

                  @current_object = { id: @new_line.id,
                                      quantity: @new_line.quantity,
                                      line_item_id: line_item1.id }
                  @new_object =     { id: '',
                                      quantity: line_item2.quantity,
                                      line_item_id: line_item2.id }
                  @updated_object = { id: @new_line.id ,
                                      quantity: line_item1.quantity - 1,
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
end
