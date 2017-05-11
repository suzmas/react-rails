class Place < ApplicationRecord
  has_many :events

  # Geocoder
  reverse_geocoded_by :latitude, :longitude do |obj, results|
    if geo = results.first
      obj.address1 = geo.address
      obj.city = geo.city
      obj.state = geo.state_code
      obj.zip = geo.postal_code
      obj.neighborhood = geo.neighborhood
    end
  end

  # If geocoder !return neighborhood, set 'hood to city
  def assign_neighborhood
    self.neighborhood = self.city if self.neighborhood.nil?
  end

  after_validation :reverse_geocode
  after_validation :assign_neighborhood

  scope :place, -> (place) { where("LOWER(places.name) LIKE ?", "%#{place}%") }
end
