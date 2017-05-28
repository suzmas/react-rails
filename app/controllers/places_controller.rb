class PlacesController < ApplicationController
  before_action :data

  def index
  end

  def location
    if (!params[:lat].nil? || !params[:lng].nil?)
      lat = params[:lat]
      lng = params[:lng]
    end

    if (!params[:loc].nil? && !params[:loc].empty?)
      s = Geocoder.search(params[:loc])
      lat = s[0].latitude
      lng = s[0].longitude
    end

    render json: make_all(lat, lng).to_json
  end

  private

    def data
      @all_prop = {
        all: make_all(32.7157, -117.1611).to_json
      }
    end

    def make_all(lat, lng)
      all = Place.near([lat, lng], 30).map do |place|
        events = Event.where(place_id: place.id)

        { place: place, events: events }
      end
    end
end
