class PlacesController < ApplicationController

  def index

    @places = Place.all
    place_props =  @places.to_json

    @places_props = {
      name: place_props
    }
  end

  def all
    @places = Place.all
    @places = Place.place(params[:place].downcase).pluck(:id)

    @places = @places.map do |place|
      {
        Place.find(place).name => {
          places: Place.find(place),
          events: Event.where(place_id: place).day(params[:day])
        }
      }
    end

    render json: @places
  end

  def place
    @place = Place.find(params[:id])
    if params[:all] == 't'
      @events = @place.events.all
    end

    render json: { place: @place, events: @events }
  end

  def event
    @event = Event.find(params[:id])

    render json: @event
  end

end
