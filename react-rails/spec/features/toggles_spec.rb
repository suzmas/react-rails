require 'rails_helper'

RSpec.feature "Toggles", type: :feature, js: true do
  context "I can toggle between the two views" do
    Steps "I am on the page" do
      Given "I am on the root page" do
        visit "/"
      end
      Then "I can click on Events" do
        click_button "Events"
      end
      And "See anferne" do
        expect(page).to have_content("ANFERNE")
      end
    end
  end
end
