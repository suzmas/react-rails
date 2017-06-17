class RenameAddressToAddress1InEvents < ActiveRecord::Migration[5.0]
  def change
    rename_column :events, :address, :address1
  end
end
