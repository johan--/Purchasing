# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
require 'declarative_authorization/maintenance'

Authorization::Maintenance::without_access_control do
  Tag.destroy_all
  tags = File.open( Rails.root.join('./lib/tasks/seed-data/', 'default_tags.txt')).readlines.map(&:chomp)
  tags.each { |t| Tag.create(name: t) }

  CannedMessage.destroy_all
  messages = File.open( Rails.root.join('./lib/tasks/seed-data/', 'default_canned.txt')).readlines.map(&:chomp)
  messages.each do |message_string|
    messages = message_string.split(',')
    CannedMessage.create(name: messages[0],
                         subject: messages[1],
                         text: messages[2],
                         note_text: messages[3],
                         default_to: messages[4],
                         default_cc: messages[5])
  end
end
