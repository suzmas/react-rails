class PlacesController < ApplicationController
  before_action :data

  def index
  end

  def location
    lat = params[:lat]
    lng = params[:lng]

    render json: make_all(lat, lng).to_json
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
      all = Place.near([lat, lng]).map do |place|
        events = Event.where(place_id: place.id)

        { place: place, events: events }
      end
    end
end
