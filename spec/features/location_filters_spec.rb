require 'rails_helper'

RSpec.feature "LocationFilters", type: :feature, js: true do
  context "I can search for filters by adding to the location search bar" do
    Steps "Filter Places by location" do
      Given "I am on the homepage" do
        visit "/"
      end
      When "I type in the search bar" do
        fill_in "search-bar", with: "San Diego, CA"
      end
      And "I click the 'Submit' button" do
        click_button "location-submit"
      end
      Then "I should see all Places" do
        expect(page).to have_selector(".panel", count: 3)
      end
      When "I change to the Events view" do
        click_button "Places"
      end
      Then "I should see all events for the first page" do
        expect(page).to have_selector(".panel", count: 7)
      end
    end
  end
end
