require 'csv'
require 'date'
require './spec/support/get_random.rb'

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
  
  task :seed_users => :environment do
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

      puts "Created record #{v.id} for #{v.name}"
    end
  end
  
  task :seed_purchases => :environment do
    # 0 Date
    # 1 Vendor
    # 2 Description
    # 3 Requester
    # 4 Department
    # 5 Price
    # 6 Fund
    # 7 Org
    # 8 Acct
    # 9 Notes / Tracking
    Purchase.destroy_all
    LineItem.destroy_all
    Receiving.destroy_all
    ReceivingLine.destroy_all
    Account.destroy_all

    amazon = Vendor.find_by(name: 'Amazon')
    amazon = Vendor.create name: 'Amazon' if amazon.nil?
    buyers = User.buyers :id
    tags = Tag.all.map{|t| t.id}
    
    lines = File.open( './lib/tasks/seed-data/requests.txt').readlines.map!( &lambda{ |x| x.chomp.split("\t") } )

    lines.each do |line|
      # Add record in database
      p = Purchase.new
      
      dt = line[0].strip
      begin
        d = Date.strptime(dt, "%m/%d/%Y")
        p.date_requested = d 
      rescue Exception => ex
        puts "!! Bad date: |#{dt}| #{dt.class} -- Found as #{d}"
        puts "#{ex.class} - #{ex.message}"
      end
      p.tracking_num = line[9]
      p.save
      puts "Created purchase #{p.id} with date #{p.date_requested}"
      
      # Try to find record of requester
      user = line[3].split(' ')
      u = User.where(last_name: user[1]).where(first_name: user[0]).first
      unless u.nil?
        p.requester = u
        puts " -- With requester #{u.id}"
      end

      # Buyer
      p.buyer_id = buyers.sample[0]

      # Vendor
      v = Vendor.find_by(name: line[1])
      v = Vendor.create(name: line[1]) if v.nil?

      p.vendors << v
      puts " -- With vendor #{v.id}"
      if GetRandom.num(50) < 10
        p.vendors << amazon
        puts " -- And Amazon"
      end

      # Add account record
      fund = line[6]
      org = line[7]
      acct = (line[8].nil? || line[8].empty?) ? 71200 : line[8]
      unless u.nil?
        a = u.accounts.where(fund: fund, org: org, acct: acct).take
        if a.nil?
          a = u.accounts.create(fund: fund, org: org, acct: acct)
          if a.errors.count > 0
            puts a.errors.try(:full_messages)
            puts "#{fund} #{org} #{acct}"
            return
          end
          puts " -- -- Created account #{a.id}"
        end
        p.account_id = a.id
        puts " -- With Account #{a.id}"
      end


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
        puts " -- - Line #{l.id}"
      end

      # Change at adding a tag
      if GetRandom.num(10) < 4
         p.purchase_to_tags.create(tag_id: tags.sample)
      end

      # Chance at adding random receiving documents
      GetRandom.num(10).times do
        if GetRandom.num(100) < 30
          rec = Receiving.create
          puts " -- With Receiving Document #{rec.id}"
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

      p.save
    end
  end

  task :seed_roles => :environment do
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