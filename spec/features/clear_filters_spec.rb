require 'rails_helper'

RSpec.feature "ClearFilters", type: :feature, js: true do

  context "I can clear all active filters" do
    Steps "Input nonsense into search bar for Places" do
      Given "I am on Place view" do
        visit "/"
      end
      When "I enter ridiculous characters into the search bar" do
        fill_in 'keyword-input', with: "xkdyshdlxjhsdflk"
      end
      Then "I should see no results" do
        expect(page).not_to have_selector(".panel")
      end
      And "When I click the RESET button" do
        click_button "reset-button"
      end
      Then "The View should reset and show fresh data" do
        expect(page).to have_selector(".panel")
      end
    end
    Steps "Input nonsense into search bar for Places" do
      Given "I am on events view" do
        visit "/"
        click_button "Events"
      end
      When "I enter ridiculous characters into the search bar" do
        fill_in 'keyword-input', with: "xkdyshdlxjhsdflk"
      end
      Then "I should see no results" do
        expect(page).not_to have_selector(".panel")
      end
      And "When I click the RESET button" do
        click_button "reset-button"
      end
      Then "The view should reset and show fresh data" do
        expect(page).to have_selector(".panel")
      end
    end
  end

end
