Rails.application.routes.draw do
  root 'places#index'

  get 'hello_world', to: 'hello_world#index'
end
