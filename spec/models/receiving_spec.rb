# == Schema Information
#
# Table name: receivings
#
#  id           :integer          not null, primary key
#  purchase_id  :integer
#  total        :integer
#  package_num  :string(255)
#  package_date :date
#  last_user    :string(255)
#  created_at   :datetime
#  updated_at   :datetime
#

require 'spec_helper'

describe Receiving do

  # Test last_user

  # Test receiving lines are destroyed

end
