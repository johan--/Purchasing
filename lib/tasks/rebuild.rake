
namespace :db do
  desc 'Rebuild the database and run migrations / seeds'

  task :rebuild => :environment do
    Rake::Task['db:drop'].invoke
    Rake::Task['db:create'].invoke
    Rake::Task['db:migrate'].invoke
    Rake::Task['db:seed_all'].invoke
  end
end
