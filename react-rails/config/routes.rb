Rails.application.routes.draw do
  root 'places#index'
  get '/location' => 'places#location'
  get '/name' => 'places#name'
end
