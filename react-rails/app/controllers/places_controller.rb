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

    if !params[:place].nil?
      @places = Place.place(params[:place].downcase).pluck(:id)
    end

    @places = @places.map do |place|

      @place = Place.find(place)
      @events = Event.where(place_id: place)

      if !params[:day].nil?
        @events = @events.merge(Event.day(params[:day]))
      end

      if !params[:food].nil?
        @events = @events.merge(Event.food(params[:food]))
      end

      if !params[:drink].nil?
        @events = @events.merge(Event.drink(params[:drink]))
      end

      (@events.length > 0) ? { @place.name => { places: @place, events: @events } } : {}
    end

    @places = @places.select { |item| !item.empty? }
    render json: JSON.pretty_generate(JSON.parse(@places.to_json))
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
