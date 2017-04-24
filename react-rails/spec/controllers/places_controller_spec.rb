require 'rails_helper'

RSpec.describe PlacesController, type: :controller do

  describe "GET #place" do
    it "returns http success" do
      get :place
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET #event" do
    it "returns http success" do
      get :event
      expect(response).to have_http_status(:success)
    end
  end

end
