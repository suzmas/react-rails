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
        click_button "Places"
        expect(page).to have_selector(".panel", count: 7)
      end
      Then "I cannot click the 'Prev' button" do
        expect(page).to have_button("prev-btn", disabled: true)
      end
      And "I cannot click 'Next' again" do
        # click_button "next-btn"
        find('#next-btn').click
        expect(page).to have_button("next-btn", disabled: true)
      end
    end
  end
end
