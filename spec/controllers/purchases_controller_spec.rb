require 'spec_helper'
include AuthenticationHelpers

#ActiveRecord::Base.logger = Logger.new(STDOUT) if defined?(ActiveRecord::Base)

describe PurchasesController do

  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :all,
                                         receiver: :edit,
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
                    receivings: {
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
      [:line_items, :receivings, :tags, :notes].each do |attribute|
      #[:receiving_lines].each do |attribute|

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

                when :receivings
                  @new_line = FactoryGirl.create(:receiving)
                  @purchase.receivings << @new_line

                  @current_object = { id: @new_line.id,
                                      package_num: @new_line.package_num }
                  @new_object =     { id: '',
                                      package_num: 'a new u251' }
                  @updated_object = { id: @new_line.id ,
                                      package_num: 'a test u251' }
                  @test_object = @purchase.receivings
                  @test_field = :package_num

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
                expect(@test_object.first[@test_field]).to eq(@new_object[@test_field])
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
end


#  def record_params
#    params.require(:purchase).permit(
#      :id, :tracking_num, :date_approved, :date_requested, :date_purchased,
#      :starred, :date_expected, :date_required, :tax_rate, :shipping, :labor, :account_id,
#      :buyer, :requester, :recipient, :vendors,
#      receivings_attributes: [ :id, :_destroy, :package_num, :package_date,
#        receiving_lines_attributes: [ :id, :_destroy, :quantity, :line_item_id ]
#      ],
#      line_items_attributes: [ :id, :_destroy, :description, :unit, :sku, :price, :quantity ],
#      purchase_to_tags_attributes: [ :id, :_destroy, :tag_id ],
#      notes_attributes: [ :id, :_destroy, :text ],
##      attachments_attributes: [ :id, :_destroy, :attachment_file_name ]
 #   )
 # end

#puts "role: #{role}"
#puts "rule: #{current_rule}"
#puts is_allowed(:update, current_rule)

