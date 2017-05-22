require 'rest-client'
require 'json'

response = RestClient.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json',
  params: {
    location: '32.715736,-117.161087',
    radius: '5000',
    type: 'restaurant',
    keyword: 'happyhour',
    key: ENV['GOOGLE_API_KEY']}
)

results = JSON.parse(response.body)

results["results"].each do |obj|
  lat = obj["geometry"]["location"]["lat"]
  lng = obj["geometry"]["location"]["lng"]
  name = obj["name"]

  Place.create!(name: name, latitude: lat, longitude: lng)
  p "Added #{name}! at #{lat} / #{lng}"
end

def make_menu
  menu = Hash.new
  (rand(10) + 5).times do |num|
    tmp = rand(20)
    menu["Item #{num}"] = (tmp <= 1) ? nil : tmp
  end
  menu
end

def make_bool
  (rand(2) == 1) ? true : false
end

days = [
  ['Monday', 'Wednesday', 'Friday'],
  ['Tuesday', 'Thursday'],
  ['Friday', 'Saturday', 'Sunday'],
  ['Monday'],
  ['Tuesday'],
  ['Wednesday'],
  ['Thursday'],
  ['Friday'],
  ['Saturday'],
  ['Sunday']
]

Place.all.each_with_index do |place, index|
  day = rand(days.length)
  days[day].each do |value|
    r1 = rand(22)
    while true do
      r2 = rand(6) + (r1 + 1)
      break if r2 < 24
    end

    place.events.create!(
      name: "Happy Hour #{index}",
      dow: value,
      start_time: "#{r1}:00",
      end_time: "#{r2}:00",
      menu: make_menu(),
      has_food: make_bool(),
      has_drink: make_bool(),
    )
  end
end
