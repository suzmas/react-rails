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

days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
Place.all.each do |place|
  days.each do |day|
    r1 = rand(5) + 3
    r2 = rand(5) + r1
    place.events.create(
      name: "Happy Hour",
      dow: day,
      start_time: "#{r1}:00",
      end_time: "#{r2}:00",
      menu: make_menu(),
      has_food: make_bool(),
      has_drink: make_bool(),
    )
  end
end
