class Event < ApplicationRecord
  belongs_to :place

  scope :day, -> (day) { where("LOWER(events.dow) = ?", "#{day}") }
end
