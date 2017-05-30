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
      if s.blank?
        data = without_geocoder(params[:loc])
      else
        lat = s[0].latitude
        lng = s[0].longitude
        data = make_all(lat, lng)
      end
    end

    render json: data.to_json
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

    def without_geocoder(loc)
      if Place.where(neighborhood: loc).blank?
        { place: [], events: [] }
        logger.debug "no results"
      else
        all = Place.where(neighborhood: loc).map do |place|
          events = Event.where(place_id: place.id)

          { place: place, events: events }
        end
        logger.debug "here are the results: #{all}"
      end
    end

end
