require 'rails_helper'

RSpec.feature "BoolFilters", type: :feature, js: true do
  context "I can toggle the food/drink buttons to filter" do
    Steps "Filter Places by those that have food" do
      Given "I am on the homepage" do
        visit "/"
      end
      When "I click the food button" do
        click_button "has-food"
      end
      Then "I should see the Places that serve food" do
        expect(page).to have_selector(".panel", count: 2)
      end
      And "I can un-toggle the food button" do
        click_button "has-food"
      end
      Then "I should see all Places" do
        expect(page).to have_selector(".panel", count: 3)
      end
    end

    Steps "Filter Places by those that have drinks" do
      Given "I am on the homepage" do
        visit "/"
      end
      When "I click the drink button" do
        click_button "has-drink"
      end
      Then "I should see Places that serve drinks" do
        expect(page).to have_selector(".panel", count: 2)
      end
      And "I can un-toggle the drink button" do
        click_button "has-drink"
      end
      Then "I should see all Places" do
        expect(page).to have_selector(".panel", count: 3)
      end
    end

    Steps "Filter Events by those that have food" do
      Given "I am on the homepage and in the Events view" do
        visit "/"
        click_button "Places"
      end
      When "I click the food button" do
        click_button "has-food"
      end
      Then "I should see Events that serve food" do
        expect(page).to have_selector(".panel", count: 4)
      end
      And "I can un-toggle the food button" do
        click_button "has-food"
      end
      Then "I should see a page of Events" do
        expect(page).to have_selector(".panel", count: 7)
      end
    end

    Steps "Filter Events by those that have drinks" do
      Given "I am on the homepage and in the Events view" do
        visit "/"
        click_button "Places"
      end
      When "I click the drink button" do
        click_button "has-drink"
      end
      Then "I should see Events that serve drink" do
        expect(page).to have_selector(".panel", count: 4)
      end
      And "I can un-toggle the drink button" do
        click_button "has-drink"
      end
      Then "I should see a page of Events" do
        expect(page).to have_selector(".panel", count: 7)
      end
    end
  end
end
