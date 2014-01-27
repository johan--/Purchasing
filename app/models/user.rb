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
#

class User < ActiveRecord::Base
  include Humanity::Base

  has_many :purchases
  has_many :notes, through: :purchases
  has_many :vendors, through: :purchases
  has_many :line_items, through: :purchases
  has_many :accounts
  has_many :attachments

  has_many :requester, class_name: 'Purchase'
  has_many :buyer, class_name: 'Purchase'
  has_many :recipient, class_name: 'Purchase'

  scope :sorted, ->{ order('last_name ASC') }
  scope :eager, ->{ includes({ accounts: :purchases }) }

  def self.search(search_string)
    unless search_string.nil?
      names = search_string.split(' ')
      first = names[0] || ""
      last = names[1] || names[0] || ""

      if names.length > 1
        User.where("lower(first_name) like ? AND lower(last_name) like ?", "%#{first.downcase}%", "%#{last.downcase}%")
      else
        User.where("lower(first_name) like ? OR lower(last_name) like ?", "%#{first.downcase}%", "%#{last.downcase}%")
      end
    else

      all
    end
  end

  def self.buyers(field='first_name')
    users = self.find_by_role(:buyer)
    users.map() { |human| {name: human.send(field), id: human.id} } if users
  end

  def self.find_by_role(role)
    roles = Humanity::Role.find_by(name: role)
    roles.humans if roles
  end

  def buyer?
    has_role? :buyer
  end

  def receiver?
    has_role? :receiver
  end

  def employee?
    has_role? :employee
  end

  def guest?
    has_role? :guest
  end

  def can_impersonate?
    has_role? :developer
  end

  # From Biola Apps
  def authorized_roles
    roles.map(&:to_s)
  end

  def role_symbols
    roles.map { |role| role.name.underscore.to_sym }
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

  def name_last_first
    "#{last_name}, #{first_name}"
  end

  def account_list
    self.accounts.map { |acct| [ acct.number, acct.id ] }
  end

  # Render the requester for TokenInput
  def as_token
    [{ "id" => self.id, "name" => self.name }].to_json
  end
end
