class PlacesController < ApplicationController

  def index
  end

  def all
    @places = Place.all

    render json: @places, include: :events
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
