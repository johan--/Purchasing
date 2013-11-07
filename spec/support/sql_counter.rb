class SqlCounter< ActiveSupport::LogSubscriber
  # http://stackoverflow.com/questions/11222942/how-to-test-the-number-of-database-calls-in-rails
  def self.run &block
    self.start_count
    yield
    self.stop_count
  end

  def self.start_count
    self.count = 0
    Thread.current['start'] = true
  end

  def self.stop_count
    Thread.current['start'] = false
    self.count
  end

  def self.count= value
    Thread.current['query_count'] = value
  end

  def self.count
    Thread.current['query_count'].to_i || 0
  end

  def sql(event)
    if Thread.current['start']
      self.class.count += 1
      #puts "logged #{event.payload[:sql]}"
    end
  end
end

SqlCounter.attach_to :active_record
