class PlacesController < ApplicationController
  before_action :data

  def index
  end

  def location
    if (!params[:lat].nil? || !params[:lng].nil?)
      lat = params[:lat]
      lng = params[:lng]
    end

    if (!params[:loc].nil?)
      s = Geocoder.search(params[:loc])
      lat = s[0].latitude
      lng = s[0].longitude
    end

    render json: make_all(lat, lng).to_json
  end

  def name
    if (!params[:lat].nil? || !params[:lng].nil?)
      lat = params[:lat]
      lng = params[:lng]
    end

    s = Geocoder.search("#{lat},#{lng}")
    p s
    render json: {address: s.address, city: s.city, state: s.state_code, zip: s.postal_code}
  end

  private

    def data
      @all_prop = {
        all: make_all(32.7157, -117.1611).to_json
      }

      @places_prop = {
        places: Place.all.to_json
      }

      @events_prop = {
        events: Event.all.to_json
      }
    end

    def make_all(lat, lng)
      all = Place.near([lat, lng], 30).map do |place|
        events = Event.where(place_id: place.id)

        { place: place, events: events }
      end
    end
end
