class PlacesController < ApplicationController
  before_action :data

  def index
  end

  def location
    lat = params[:lat]
    lng = params[:lng]

    render json: Place.near([lat, lng])
  end
  
  private

    def data
      @all_prop = {
        all: make_all.to_json
      }

      @places_prop = {
        places: Place.all.to_json
      }

      @events_prop = {
        events: Event.all.to_json
      }
    end

    def make_all
      all = Place.all.map do |place|
        @place = Place.find(place.id)
        @events = Event.where(place_id: place.id)

        { place: @place, events: @events }
      end
    end
end
