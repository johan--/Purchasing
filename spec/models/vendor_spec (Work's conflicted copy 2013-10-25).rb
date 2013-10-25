# == Schema Information
#
# Table name: vendors
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  website     :string(255)
#  email       :string(255)
#  address     :string(255)
#  city        :string(255)
#  state       :string(255)
#  zip_code    :string(255)
#  country     :string(255)
#  phone       :string(255)
#  fax         :string(255)
#  account_num :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#

require 'spec_helper'

describe Vendor do
  # Website parse

  # Phone parse

  # Validates
    #Name

  # check_for_purchases

  # Scopes
  describe '- Scopes' do

    describe '- Eager' do
    end

    describe '- Filter' do
    end

    describe '- Sorted' do
    end

    describe '- Letter' do
    end

    describe '- Token' do
    end
  end

end
