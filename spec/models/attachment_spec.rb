# == Schema Information
#
# Table name: attachments
#
#  id                      :integer          not null, primary key
#  purchase_id             :integer
#  attachment_file_name    :string(255)
#  attachment_content_type :string(255)
#  attachment_file_size    :integer
#  attachment_updated_at   :datetime
#  last_user               :string(255)
#  created_at              :datetime
#  updated_at              :datetime
#

require 'spec_helper'

describe Attachment do

  # Test last_user

  # Test validates
    # Attachment

end
