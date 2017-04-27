class Event < ApplicationRecord
  belongs_to :place

  scope :day, -> (day) { where("LOWER(events.dow) = ?", "#{day}") }
  scope :food, -> (food) { where("events.has_food = ?", "#{food}") }
  scope :drink, -> (drink) { where("events.has_drink = ?", "#{drink}") }
end
