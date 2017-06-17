class Event < ApplicationRecord
  belongs_to :place
  after_create :add_lat_lng, :format_header, :format_address

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

    def format_header
      place = Place.find(self.place_id)
      self.name = place.name
      self.save
    end

    def format_address
      place = Place.find(self.place_id)
      self.address1 = place.address1
      self.save
    end
end
