class Place < ApplicationRecord
  has_many :events

  # Geocoder
  reverse_geocoded_by :latitude, :longitude do |obj, results|
    if geo = results.first
      obj.address1 = geo.address
      obj.city = geo.city
      obj.state = geo.state_code
      obj.zip = geo.postal_code
    end
  end

  after_validation :reverse_geocode
end
