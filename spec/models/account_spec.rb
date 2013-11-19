# == Schema Information
#
# Table name: accounts
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  fund       :integer
#  org        :integer
#  acct       :integer
#  created_at :datetime
#  updated_at :datetime
#

require 'spec_helper'

describe Account do

  # Test validates:

    #validates :fund, presence: true
    #validates :org, presence: true
    #validates :acct, presence: true
    #validates :fund, length: { is: 6 }
    #validates :org, length: { is: 6 }
    #validates :acct, length: { is: 5 }
    #validates :acct, uniqueness: { scope: [ :org, :fund, :user_id ] }

  describe '- Validations' do
    describe '- Account #' do
      before(:each) do
        without_access_control do
          @account = FactoryGirl.create(:account)
        end
      end

      it '- Can set the account # with a string' do
        without_access_control do
          expect(@account.number = '123456-123456-12345').not_to be_false
        end
      end

      it '- Will fail if an empty string is sent' do
        without_access_control do
          @account.number = ''
          expect(@account.save).to be_false
        end
      end

      it '- Will fail if two dashes are not present' do
        without_access_control do
          @account.number = '123-123'
          expect(@account.save).to be_false
        end
      end

      it '- Will fail if three numbers are not present ' do
        without_access_control do
          @account.number = '123-123-'
          expect(@account.save).to be_false
        end
      end

      describe '- Validates number lengths' do
        it '- Validates FUND as 6 digits' do
          without_access_control do
            @account.number = '12345-123456-12345'
            expect(@account.save).to be_false
            @account.number = '123456-123456-12345'
            expect(@account.save).to be_true
          end
        end
        it '- Validates ORG as 6 digits' do
          without_access_control do
            @account.number = '123456-12356-12345'
            expect(@account.save).to be_false
            @account.number = '123456-123456-12345'
            expect(@account.save).to be_true
          end
        end
        it '- Validates ACCT as 5 digits' do
          without_access_control do
            @account.number = '123456-123456-1234'
            expect(@account.save).to be_false
            @account.number = '123456-123456-12345'
            expect(@account.save).to be_true
          end
        end
      end
    end

  end
end
