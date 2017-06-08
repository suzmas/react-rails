class AddLngToEvents < ActiveRecord::Migration[5.0]
  def change
    add_column :events, :lng, :float
  end
end
