class Event < ApplicationRecord
  belongs_to :place
  # before_save :date_to_utc
  #
  #
  # def date_to_utc
  #   self.start_time.utc
  # end

  scope :day, -> (day) { where("LOWER(dow) = ?", day) }
  scope :food, -> (food) { where(has_food: food) }
  scope :drink, -> (drink) { where(has_drink: drink) }
end
