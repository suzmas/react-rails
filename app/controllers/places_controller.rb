class PlacesController < ApplicationController
  before_action :data

  def index
  end

  def location
    if (!params[:lat].nil? || !params[:lng].nil?)
      lat = params[:lat]
      lng = params[:lng]
    end

    if (!params[:loc].blank?)
      s = Geocoder.search(params[:loc])
      if s.blank?
        data = without_geocoder(params[:loc])
      else
        lat = s[0].latitude
        lng = s[0].longitude
        data = make_all(lat, lng)
      end
    else
      data = make_all(lat, lng)
    end


    if data.blank?
      data = without_geocoder(params[:loc])
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
        events = time_to_int(events)
        { place: place, events: events }
      end
    end

    def without_geocoder(loc)
      if Place.where(neighborhood: loc).blank?
        { place: [], events: [] }
      else
        all = Place.where(neighborhood: loc).map do |place|
          events = Event.where(place_id: place.id)
          events = time_to_int(events)
          { place: place, events: events }
        end
      end
    end

    def time_to_int(events)
      events.each do |event|
        event.start_time = event.start_time.hour
        event.end_time = event.end_time.hour
      end
    end

end
