class GetRandom < Random
  CHARS = [('a'..'z').to_a, ' ', (0..9).to_a, ('A'..'Z').to_a].flatten
  ITEMS = ['Wheel', 'Hinge', 'CD', 'Book', 'Software', 'Computer', 'Lamp', 'Speaker', 'Phone', 'Paperclips', 'Pencils', 'Scissors', 'Paper', 'Canned Air', 'Stapler', 'Copying Machine', 'Shelving']
  def self.string(len=15)
    res = ""
    len.times { res += CHARS.sample.to_s }
    res
  end

  def self.num(num=50, base=0)
    rand(num) + base
  end

  def self.unit
    ['EA', 'CS', 'BX', 'TB'].sample
  end

  def self.description(len=25)
    res = ""
    while res.length < len do
      thing_to_do = GetRandom.num(8)
      val = case thing_to_do
      when 3..8 then ITEMS.sample
      when 2 then GetRandom.string(10)
      when 1 then GetRandom.num(20).to_s + "/" + GetRandom.num(20).to_s
      when 0 then GetRandom.num(100)
      end

      res += val.to_s + " "
    end

    res
  end
end
