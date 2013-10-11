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

class User < ActiveRecord::Base
  include Humanity::Base

  has_many :purchases
  has_many :notes, :through => :purchases
  has_many :vendors, :through => :purchases
  has_many :line_items, :through => :purchases
  has_many :accounts

  has_many :requester, class_name: 'Purchase'
  has_many :buyer, class_name: 'Purchase'

  def self.buyers(field='first_name')
    # This monkeypatch on Humanity allows for a reverse lookup
    # has_many :users, through: :assignments, source: :human, source_type: 'User'
    if self.all.length > 0
      role_id = Humanity::Role.find_by(name: 'buyer').id
      self.joins(:assignments).where(assignments: {role_id: role_id}).reduce([]) { |res, v| res << [v.send(field), v.id] } # Format is name, id for input list
    end
  end

  def buyer?
    has_role? :buyer
  end

  def can_impersonate?
    has_role? :admin
  end

  # From Biola Apps
  def authorized_roles
    roles.map(&:to_s)
  end
  
  def update_from_cas!(extra_attributes)
    cas_attr = HashWithIndifferentAccess.new(extra_attributes)

    entitlements = User.urns_to_roles(cas_attr[:eduPersonEntitlement], Settings.urn_namespaces)

    self.username ||= cas_attr[:cn].try(:first)
    self.photo_url ||= cas_attr[:url].try(:first)
    self.title ||= cas_attr[:title].try(:first)
    self.email ||= cas_attr[:mail].try(:first)
    self.first_name ||= cas_attr[:eduPersonNickname].try(:first)
    self.last_name ||= cas_attr[:sn].try(:first)

    ( self.save &&
      self.update_roles!(cas_attr[:eduPersonAffiliation], :affiliation) &&
      self.update_roles!(entitlements, :entitlement)
    )
  end

  # Find URNs that match the namespaces and remove the namespace
  # See http://en.wikipedia.org/wiki/Uniform_Resource_Name
  def self.urns_to_roles(urns, nids)
    clean_urns = urns.map { |e| e.gsub(/^urn:/i, '') }
    clean_nids = nids.map { |n| n.gsub(/^urn:/i, '') }

    clean_urns.map { |urn|
      clean_nids.map { |nid|
        urn[0...nid.length] == nid ? urn[nid.length..urn.length] : nil
      }
    }.flatten.compact
  end

  def account_list
    self.accounts.map { |acct| [ acct.number, acct.id ] }
  end
end
