Rails.application.routes.draw do
  root 'places#index'

  get 'places/place/:id' => 'places#place'

  get 'places/event/:id' => 'places#event'

  get 'hello_world', to: 'hello_world#index'
end
