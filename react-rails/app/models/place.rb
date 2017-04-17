class Place < ApplicationRecord
  has_many :events

  # Geocoder
  geocoded_by :full_address
  after_validation :geocode

  private

    def full_address
      "#{address1} #{address2}, #{city} #{state} #{zip}"
    end
end
