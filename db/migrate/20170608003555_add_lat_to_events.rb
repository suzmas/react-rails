class AddLatToEvents < ActiveRecord::Migration[5.0]
  def change
    add_column :events, :lat, :float
  end
end
