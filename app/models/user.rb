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
  has_many :notes
  has_many :notes, inverse_of: :user, through: :purchases
  has_many :accounts, inverse_of: :user
  has_many :attachments, inverse_of: :user

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
    users.map() { |human| {name: human.send(field), id: human.id} }
  end

  def self.find_by_role(role)
    Humanity::Role.find_by(name: role).try(:humans)
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

  def manager?
    has_role? :manager
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

    self.username = cas_attr[:cn].try(:first)
    self.photo_url = cas_attr[:url].try(:first)
    self.title = cas_attr[:title].try(:first)
    self.department = cas_attr[:department].try(:first)
    self.email = cas_attr[:mail].try(:first)
    self.first_name = cas_attr[:eduPersonNickname].try(:first)
    self.last_name = cas_attr[:sn].try(:first)

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

  def update_token(attributes)
    raise ArgumentError if attributes.blank?
    raise ArgumentError if attributes['netid'].blank?

    self.username = attributes['netid']                   unless attributes['netid'].blank?
    self.first_name = attributes['firstname']             unless attributes['firstname'].blank?
    self.last_name = attributes['lastname']               unless attributes['lastname'].blank?
    self.title = attributes['title']                      unless attributes['title'].blank?
    self.department = attributes['department']            unless attributes['department'].blank?
    self.photo_url = attributes['photourl']               unless attributes['photourl'].blank?
    self.phone = [attributes['phone']].flatten.join(', ') unless attributes['phone'].blank?

    email = attributes['email']
    self.email = email.is_a?(Array) ? email.first : email unless email.blank?

    self.save
    # Do not update roles!  This could expose app to users, and we don't need this data
  end
end
