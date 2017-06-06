require 'rails_helper'

RSpec.describe Place, type: :model do
  describe 'Place' do

    it 'has to be real' do
      expect{ Place.new }.to_not raise_error
    end

    it 'has to have a name and phone' do
      place = Place.create(name: 'Rare Form', phone: '(619)578-2392')
      expect(place.name).to eq 'Rare Form'
      expect(place.phone).to eq '(619)578-2392'
    end

    it 'has a full address' do
      place = Place.create(latitude: '32.709138', longitude: '-117.157579')
      expect(place.address1).to eq '325 Seventh Ave, San Diego, CA 92101, USA'
      expect(place.city).to eq 'San Diego'
      expect(place.state).to eq 'CA'
      expect(place.zip).to eq '92101'

      expect(place.neighborhood).to eq 'East Village'

      expect(place.latitude).to_not be_nil
      expect(place.longitude).to_not be_nil
    end

  end
end
