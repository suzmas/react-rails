class Event < ApplicationRecord
  belongs_to :place
  before_create :add_lat_lng

  scope :day, -> (day) { where("LOWER(dow) = ?", day) }
  scope :food, -> (food) { where(has_food: food) }
  scope :drink, -> (drink) { where(has_drink: drink) }

  private

    def add_lat_lng
      
    end
end
