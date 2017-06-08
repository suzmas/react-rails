require 'rails_helper'

RSpec.feature "SearchFilters", type: :feature, js: true do
  before(:each) do
    @p1 = Place.first
    @e1 = Event.first
  end
  context "I can search for Places and Events" do
    Steps "Input search in search bar for Places" do
      Given "I am on the home page and Place view" do
        visit "/"
      end
      When "I enter a Place's name" do
        fill_in 'keyword-input', with: @p1.name
      end
      Then "I should see only one Place" do
        expect(page).to have_selector(".panel", count: 1)
      end
    end

    Steps "Input search in search bar for Events" do
      Given "I am on the Events view" do
        visit "/"
        click_button "Events"
      end
      When "I enter an Event's name" do
        fill_in 'keyword-input', with: @e1.name
      end
      Then "I should see only one Event" do
        expect(page).to have_selector(".panel", count: 1)
      end
    end
  end

  

end
