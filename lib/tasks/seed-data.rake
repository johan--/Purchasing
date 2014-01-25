require 'csv'
require 'date'
require './spec/support/get_random.rb'
require 'declarative_authorization/maintenance'

namespace :db do
	desc "Seeds the database with custom data"
	task :seed_all => :environment do
    Rake::Task['db:seed'].invoke
    Rake::Task['db:seed_vendors'].invoke
    Rake::Task['db:seed_users'].invoke
    Rake::Task['db:seed_roles'].invoke
    Rake::Task['db:seed_purchases'].invoke
  end

  task :seed_vendors => :environment do
    Authorization::Maintenance::without_access_control do

      # 0 City
      # 1 State
      # 2 Address
      # 3 Email
      # 4 Name
      # 5 Phone
      # 6 Fax
      # 7 Area Code
      # 8 Website
      Vendor.destroy_all
      CSV.foreach('./lib/tasks/seed-data/vendors.csv', headers: false) do |vendor|
        v = Vendor.new
        v.name = vendor[4]
        v.website = vendor[8]
        v.email = vendor[3]
        v.address = vendor[2]
        v.city = vendor[0]
        v.state = vendor[1]
        v.zip_code = vendor[7]
        v.country = 'USA'
        v.phone = vendor[5]
        v.fax = vendor[6]
        v.save
        puts "Created record #{v.id} for #{v.name}"
      end
    end
  end

  task :seed_users => :environment do
    Authorization::Maintenance::without_access_control do
      # 0 Department
      # 1 Email
      # 2 Number
      # 3 First
      # 4 Last
      # 5 Box
      # 6 NetId
      # 7 Title
      # 8 BiolaID
      User.destroy_all

      CSV.foreach('./lib/tasks/seed-data/directory.csv', headers: false) do |user|
        v = User.new
        v.first_name = user[3]
        v.last_name = user[4]
        v.title = user[7]
        v.email = user[1]
        v.phone = user[2]
        v.username = user[6]
        v.department = user[0]
        v.save

        roles = [:employee]
        v.update_roles!(roles, :roles)

        GetRandom.num(10).times do
          new_acct = Account.new
          new_acct.fund = 101000
          new_acct.org = ("%06d" % GetRandom.num(999_999)).to_i
          new_acct.acct = ("%05d" % GetRandom.num(99_999)).to_i
          v.accounts << new_acct
        end

        puts "Created record #{v.id} for #{v.name}"
      end
    end
  end

  task :seed_roles => :environment do
    Authorization::Maintenance::without_access_control do
      roles = {
        :buyer => ['Breanna Klett', 'Irene Moonitz', 'Jim Samples', 'Patrick Ko', 'Wendy Walker'],
        :admin => ['Ed Alvarez', 'Jim Samples'],
        :receiver => ['Ric Price', 'Chad Duarte'],
        :developer => ['Jeff Silzer', 'John Ratcliff']
      }

      roles.each do |role, people|
        people.each do |person|
          person = person.split(' ')
          u = User.find_by(first_name: person.first, last_name: person.last)
          u.update_roles!([role], :roles) unless (u.nil? || u.has_role?(role))
        end
      end
    end
  end

  task :seed_purchases => :environment do
    Authorization::Maintenance::without_access_control do

      Purchase.destroy_all
      LineItem.destroy_all
      Receiving.destroy_all
      ReceivingLine.destroy_all

      amazon = Vendor.find_or_create_by(name: 'Amazon')
      vendors = Vendor.all
      users = User.all
      buyers = User.buyers :name
      raise ArgumentError if buyers.nil?
      tags = Tag.all.map{|t| t.id}
      current_day = DateTime.now

      1_000.times do |record_number|

        p = Purchase.new

        # 1/20 chance of subtracting a day
        current_day = current_day - 1.day if rand(20) == 1

        # Setup date
        week_day = current_day.wday
        week_day += 7 if week_day == 0
        current_day = current_day - (week_day - 5).day if week_day > 5
        p.date_requested = current_day

        # Tracking
        p.tracking_num = GetRandom.string(25)
        p.courier = ['UPS', 'USPS', 'FedEx', 'OnTrac'].sample
        p.save
        puts "Created purchase #{p.id} with date #{p.date_requested}"

        # Requester/Recipient  1/50 chance of recipient not being requester
        p.requester = users.sample
        p.recipient = (rand(50) == 1) ? users.sample : p.requester

        # Buyer
        p.buyer_id = buyers.sample[:id]

        if !p.buyer_id.nil? && p.buyer_id != 0
          # Date purchased ( 8/10 chance of being purchased)
          if GetRandom.num(10) <= 8
            p.date_purchased = current_day
            puts " - Purchased on #{p.date_purchased}"
            # 3/10 chance of being reconciled
            p.date_reconciled = current_day if GetRandom.num(10) <= 3
            puts " - Reconciled on #{p.date_reconciled}"
          end
        end
        p.save

        # Vendor, 1 /5 chance of also being Amazon
        p.vendors << vendors.sample
        p.vendors << amazon if GetRandom.num(50) < 10

        # Account
        sample_account = p.requester.accounts.sample
        p.account_id = sample_account.id unless sample_account.nil?

        # Add random line items
        GetRandom.num(15, 1).times do |line|
          l = LineItem.create(
            description: GetRandom.description( GetRandom.num(50) ),
            quantity: GetRandom.num(25, 1),
            price: GetRandom.num(1_000, 1) / 100,
            sku: GetRandom.string(15),
            unit: GetRandom.unit
          )
          p.line_items << l
        end

        # Change at adding a tag
        if GetRandom.num(10) < 4
           p.purchase_to_tags.create(tag_id: tags.sample)
        end

        unless p.date_purchased.nil?

          # Chance at adding random receiving documents
          GetRandom.num(10).times do
            if GetRandom.num(100) < 30
              rec = Receiving.new
              rec.package_num = "#{['U', 'M', 'W', 'S'].sample}#{GetRandom.num(3)}"
              rec.package_date = DateTime.now - GetRandom.num(15)
              rec.save

              p.receivings << rec

              p.line_items.each do |line|
                if GetRandom.num(10) < 4
                  l = ReceivingLine.new
                  l.line_item_id = line.id
                  l.quantity = GetRandom.num(line.quantity) # This might exceed the quantity of the line
                  rec.receiving_lines << l
                  l.save
                  puts " -- - Line #{l.id}"
                end
              end
            end
          end
        end

        p.save
      end
    end
  end
end
