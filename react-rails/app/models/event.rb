class Event < ApplicationRecord
  belongs_to :place

  scope :day, -> (day) { where("LOWER(dow) = ?", day) }
  scope :food, -> (food) { where(has_food: food) }
  scope :drink, -> (drink) { where(has_drink: drink) }
end
