class CreateEvents < ActiveRecord::Migration[5.0]
  def change
    create_table :events do |t|
      t.references :place, foreign_key: true
      t.string :name
      t.string :dow
      t.time :start_time
      t.time :end_time
      t.jsonb :menu
      t.boolean :has_food
      t.boolean :has_drink

      t.timestamps
    end
  end
end
