require 'rails_helper'

RSpec.feature "TimeFilters", type: :feature, js: true do
  context "I can filter by time for Places and Events" do
    Steps "I can select the time dropdown and click on AM/PM toggle Places" do
      Given "I am on the home page and Place view" do
        visit "/"
      end
      When "I select a time from the dropdown" do
        click_button "hour_input"
        click_button "4:00"
      end
      And "I can click on PM" do
        click_button "PM"
      end
      Then "I should see the Places that have Events during this time" do
        expect(page).to have_selector(".panel", count: 2)
      end
      And "I can click on AM" do
        click_button "AM"
      end
      Then "I should see the Places that have Events during this time" do
        expect(page).to have_selector(".panel", count: 0)
      end
    end

    Steps "I can select the time dropdown and click on AM/PM for Events" do
      Given "I am on the homepage and Events view" do
        visit "/"
        click_button "Events"
      end
      When "I select a time from the dropdown" do
        click_button "hour-input"
        click_button "8:00"
      end
      And "I can click on PM" do
        click_button "PM"
      end
      Then "I should see the Events during that time" do
        expect(page).to have_selector(".panel", count: 3)
      end
      And "I can click on AM" do
        click_button "AM"
      end
      Then "I should see the Events during that time" do
        expect(page).to have_selector(".panel", count: 2)
      end
    end

    Steps "I can select the day of week dropdown for Places/Events" do
      Given "I am on the homepage" do
        visit "/"
      end
      When "I can select a day of the week from the dropdown" do
        click_button "day-input"
        click_button "Monday"
      end
      Then "I should see the Places that have Events during this day" do
        expect(page).to have_selector(".panel", count: 2)
      end
      And "I can switch to Events" do
        click_button "Events"
      end
      Then "I should see the Events during this day" do
        expect(page).to have_selector(".panel", count: 2)
      end
    end
  end
end
