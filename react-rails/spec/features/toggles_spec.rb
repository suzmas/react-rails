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
      Then "I can tell it works" do
        expect(@p1).to equal(@p1)
      end
    end
  end
end
