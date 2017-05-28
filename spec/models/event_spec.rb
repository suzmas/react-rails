require 'rails_helper'

RSpec.describe Event, type: :model do
  before (:each) do
    @p = Place.create(
      name: 'Rare Form',
      address1: '793 J St',
      city: 'San Diego',
      state: 'CA',
      zip: '92101',
      phone: '(619)578-2392')
  end

  describe 'Event' do

    it 'has to be real' do
      expect{ Event.new }.to_not raise_error
    end

    it 'has all fields' do
      event = Event.create(
        place_id: @p.id,
        name: 'Happy Hour',
        dow: 'Monday',
        start_time: '5:00',
        end_time: '7:00',
        has_food: false,
        has_drink: true,
        menu: {
          'The Basil G&T': {
            price: '8.00'
          },
          'Golden Child Hefe': {
            price: '6.00'
          }
        }
      )

      expect(event.place_id).to eq @p.id
      expect(event.name).to eq 'Happy Hour'
      expect(event.dow).to eq 'Monday'
      expect(event.start_time).to eq Time.new(2000, 1, 1, 5, 0, 0, "+00:00")
      expect(event.end_time).to eq Time.new(2000, 1, 1, 7, 0, 0, "+00:00")
      expect(event.has_food).to eq false
      expect(event.has_drink).to eq true
      expect(event.menu).to eq ({
        "The Basil G&T" => {
          "price" => "8.00"
        },
        "Golden Child Hefe" => {
          "price" => "6.00"
        }
      })
    end

  end
end
