# Rare Form
p1 = Place.create!(name: 'Rare Form', address1: '793 J St', city: 'San Diego',
  state: 'CA', zip: '92101', phone: '(619)578-2392')
event1 = Event.create!(place_id: p1.id, name: 'Happy Hour', dow: 'Monday',
  start_time: '17:00', end_time: '19:00', has_food: false, has_drink: true,
  menu: { 'Dummy1': { price: '4.00' }, 'Dummy2': { price: '5.00' } }
)
event2 = Event.create!(place_id: p1.id, name: 'Happy Hour', dow: 'Tuesday',
  start_time: '17:00', end_time: '19:00', has_food: false, has_drink: true,
  menu: { 'Dummy1': { price: '4.00' }, 'Dummy2': { price: '5.00' } }
)
event3 = Event.create!(place_id: p1.id, name: 'Happy Hour', dow: 'Wednesday',
  start_time: '17:00', end_time: '19:00', has_food: false, has_drink: true,
  menu: { 'Dummy1': { price: '4.00' }, 'Dummy2': { price: '5.00' } }
)
event4 = Event.create!(place_id: p1.id, name: 'Happy Hour', dow: 'Thursday',
  start_time: '17:00', end_time: '19:00', has_food: false, has_drink: true,
  menu: { 'Dummy1': { price: '4.00' }, 'Dummy2': { price: '5.00' } }
)
event5 = Event.create!(place_id: p1.id, name: 'Happy Hour', dow: 'Friday',
  start_time: '17:00', end_time: '19:00', has_food: false, has_drink: true,
  menu: { 'Dummy1': { price: '4.00' }, 'Dummy2': { price: '5.00' } }
)
p "Rare Form finished!"


# Monkey Paw
p2 = Place.create!(name: 'Monkey Paw', address1: '805 16th St', city: 'San Diego',
  state: 'CA', zip: '92101', phone: '(619)358-9901')
event6 = Event.create!(place_id: p2.id, name: 'Happy Hour', dow: 'Monday',
  start_time: '17:00', end_time: '19:00', has_food: false, has_drink: true,
  menu: { 'Dummy1': { price: '4.00' }, 'Dummy2': { price: '5.00' } }
)
event7 = Event.create!(place_id: p2.id, name: 'Happy Hour', dow: 'Tuesday',
  start_time: '17:00', end_time: '19:00', has_food: false, has_drink: true,
  menu: { 'Dummy1': { price: '4.00' }, 'Dummy2': { price: '5.00' } }
)
event8 = Event.create!(place_id: p2.id, name: 'Happy Hour', dow: 'Wednesday',
  start_time: '17:00', end_time: '19:00', has_food: false, has_drink: true,
  menu: { 'Dummy1': { price: '4.00' }, 'Dummy2': { price: '5.00' } }
)
event9 = Event.create!(place_id: p2.id, name: 'Happy Hour', dow: 'Thursday',
  start_time: '17:00', end_time: '19:00', has_food: false, has_drink: true,
  menu: { 'Dummy1': { price: '4.00' }, 'Dummy2': { price: '5.00' } }
)
event10 = Event.create!(place_id: p2.id, name: 'Happy Hour', dow: 'Friday',
  start_time: '17:00', end_time: '19:00', has_food: false, has_drink: true,
  menu: { 'Dummy1': { price: '4.00' }, 'Dummy2': { price: '5.00' } }
)
p "Monkey Paw finished!"


# Bluefoot Bar & Lounge
p3 = Place.create!(name: 'Bluefoot Bar & Lounge', address1: '3404 30th St', city: 'San Diego',
  state: 'CA', zip: '92104', phone: '(619)756-7891')
event11 = Event.create!(place_id: p2.id, name: 'Happy Hour', dow: 'Monday',
  start_time: '17:00', end_time: '19:00', has_food: false, has_drink: true,
  menu: { 'Dummy1': { price: '4.00' }, 'Dummy2': { price: '5.00' } }
)
event12 = Event.create!(place_id: p2.id, name: 'Happy Hour', dow: 'Tuesday',
  start_time: '17:00', end_time: '19:00', has_food: false, has_drink: true,
  menu: { 'Dummy1': { price: '4.00' }, 'Dummy2': { price: '5.00' } }
)
event13 = Event.create!(place_id: p2.id, name: 'Happy Hour', dow: 'Wednesday',
  start_time: '17:00', end_time: '19:00', has_food: false, has_drink: true,
  menu: { 'Dummy1': { price: '4.00' }, 'Dummy2': { price: '5.00' } }
)
event14 = Event.create!(place_id: p2.id, name: 'Happy Hour', dow: 'Thursday',
  start_time: '17:00', end_time: '19:00', has_food: false, has_drink: true,
  menu: { 'Dummy1': { price: '4.00' }, 'Dummy2': { price: '5.00' } }
)
event15 = Event.create!(place_id: p2.id, name: 'Happy Hour', dow: 'Friday',
  start_time: '17:00', end_time: '19:00', has_food: false, has_drink: true,
  menu: { 'Dummy1': { price: '4.00' }, 'Dummy2': { price: '5.00' } }
)
p "Bluefoot Bar & Lounge finished!"
