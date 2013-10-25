# == Schema Information
#
# Table name: users
#
#  id               :integer          not null, primary key
#  username         :string(255)
#  first_name       :string(255)
#  last_name        :string(255)
#  title            :string(255)
#  email            :string(255)
#  department       :string(255)
#  phone            :integer
#  photo_url        :string(255)
#  current_login_at :datetime
#  last_login_at    :datetime
#  login_count      :integer
#  created_at       :datetime
#  updated_at       :datetime
#  department_id    :integer
#

require 'spec_helper'

describe User do

  context '- It aliases User to Requester and Recipient' do
    before (:each) do
    end
  end

end
