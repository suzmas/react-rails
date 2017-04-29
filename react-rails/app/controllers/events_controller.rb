class EventsController < ApplicationController
  before_action :data

  def index
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
      all = Event.all.map do |place|
        @event = Event.find(event.id)
        @place = { name: @event.place.name, address: @event.place.name.address1 }

        { place: @place, event: @event }
      end
    end
end
