require 'rails_helper'

RSpec.feature "Toggles", type: :feature, js: true do
  context "I can toggle between the two views and pages" do
    Steps "Go to main page" do
      Given "I am on the root page" do
        visit "/"
      end
      Then "I can see the number of places" do
        expect(page).to have_selector(".panel", count: 3)
      end
      And "I can click the 'Events' button to see the number of events" do
        click_button "Events"
        expect(page).to have_selector(".panel", count: 5)
      end
      Then "I cannot click the 'Prev' button" do
        expect(page).to have_button("Prev", disabled: true)
      end
      Then "I can click the 'Next' button to see the remaining events" do
        click_button "Next"
        expect(page).to have_selector(".panel", count: 2)
      end
      And "I cannot click 'Next' again" do
        expect(page).to have_button("Next", disabled: true)
      end
    end
  end
end
