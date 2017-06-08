class Event < ApplicationRecord
  belongs_to :place
  after_create :add_lat_lng

  scope :day, -> (day) { where("LOWER(dow) = ?", day) }
  scope :food, -> (food) { where(has_food: food) }
  scope :drink, -> (drink) { where(has_drink: drink) }

  private

    def add_lat_lng
      place = Place.find(self.place_id)
      self.latitude = place.latitude
      self.longitude = place.longitude
      self.save
    end
end
