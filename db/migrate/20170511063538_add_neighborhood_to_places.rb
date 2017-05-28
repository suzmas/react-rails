class AddNeighborhoodToPlaces < ActiveRecord::Migration[5.0]
  def change
    add_column :places, :neighborhood, :string
  end
end
