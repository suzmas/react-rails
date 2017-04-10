# Global rules for all API-based controllers

class Api::V1::BaseController < ApplicationController
  respond_to :json
end
