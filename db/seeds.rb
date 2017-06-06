require 'rest-client'
require 'json'

case Rails.env
##################
##  DEVELOPMENT ##
##################
when "development"
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
    names = ["pizza", "burger", "red wine", "wings", "IPA", "whiskey", "vodka",
      "tequila", "fries", "mimosa", "fish", "appetizer", "steak", "salad", "broccoli",
      "avocado", "burrito", "taco", "Coors", "Mickey's", "sour"]
    menu = Hash.new
    (rand(10) + 5).times do |num|
      tmp = rand(20)
      menu["#{names[rand(names.length)]} #{num}"] = (tmp <= 1) ? nil : tmp
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
    place_names = ["Pizza Time", "Burrito Time", "Taco Time", "Fiesta Time",
      "Sushi Time", "Beer Time", "Shots Time", "Get Down Time", "Help Me Out Time"
    ]
    day = rand(days.length)
    days[day].each do |value|
      r1 = rand(22)
      while true do
        r2 = rand(6) + (r1 + 1)
        break if r2 < 24
      end

      place.events.create!(
        name: "#{place_names[rand(place_names.length)]} #{index}",
        dow: value,
        start_time: "#{r1}:00",
        end_time: "#{r2}:00",
        menu: make_menu(),
        has_food: make_bool(),
        has_drink: make_bool(),
      )
    end
  end

##################
###    TEST    ###
##################
when "test"
  @p1 = Place.create(
    name: "Thrusters Lounge",
    latitude: "32.798243",
    longitude: "-117.255700"
  )
  p "Created #{@p1.name}"

  @p2 = Place.create(
    name: "Tacos El Gordo",
    latitude: "32.630186",
    longitude: "-117.093245"
  )
  p "Created #{@p2.name}"

  @p3 = Place.create(
    name: "Alexander's",
    latitude: "32.740912",
    longitude: "-117.129128"
  )
  p "Created #{@p3.name}"

  @e1 = @p1.events.create(
    name: "Whiskey Hour",
    dow: "Monday",
    start_time: "18:00",
    end_time: "19:00",
    menu: "",
    has_food: false,
    has_drink: true,
  )
  p "Created #{@e1.name}"

  @e2 = @p1.events.create(
    name: "Power Hour",
    dow: "Wednesday",
    start_time: "17:00",
    end_time: "18:00",
    menu: "",
    has_food: false,
    has_drink: true,
  )
  p "Created #{@e2.name}"

  @e3 = @p1.events.create(
    name: "Day Fade",
    dow: "Sunday",
    start_time: "9:00",
    end_time: "14:00",
    menu: "",
    has_food: false,
    has_drink: true,
  )
  p "Created #{@e3.name}"

  @e4 = @p2.events.create(
    name: "Taco Tuesday!",
    dow: "Tuesday",
    start_time: "8:00",
    end_time: "21:00",
    menu: "",
    has_food: true,
    has_drink: false,
  )
  p "Created #{@e4.name}"

  @e5 = @p2.events.create(
    name: "Al Pastor, All day",
    dow: "Friday",
    start_time: "8:00",
    end_time: "21:00",
    menu: "",
    has_food: true,
    has_drink: false,
  )
  p "Created #{@e5.name}"

  @e6 = @p3.events.create(
    name: "Pizza and Beer",
    dow: "Monday",
    start_time: "18:00",
    end_time: "21:00",
    menu: "",
    has_food: true,
    has_drink: true,
  )
  p "Created #{@e6.name}"

  @e7 = @p3.events.create(
    name: "Penne Friday",
    dow: "Thursday",
    start_time: "16:00",
    end_time: "20:00",
    menu: "",
    has_food: true,
    has_drink: false,
  )
  p "Created #{@e7.name}"
end
