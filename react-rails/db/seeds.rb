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
