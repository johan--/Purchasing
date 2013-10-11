# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20131007043212) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: true do |t|
    t.integer  "user_id"
    t.integer  "fund"
    t.integer  "org"
    t.integer  "acct"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "accounts", ["user_id"], name: "index_accounts_on_user_id", using: :btree

  create_table "assignments", force: true do |t|
    t.integer "human_id"
    t.string  "human_type"
    t.integer "role_id",    null: false
    t.string  "source"
  end

  add_index "assignments", ["human_id", "role_id"], name: "index_assignments_on_human_id_and_role_id", using: :btree
  add_index "assignments", ["human_id"], name: "index_assignments_on_human_id", using: :btree
  add_index "assignments", ["role_id"], name: "index_assignments_on_role_id", using: :btree
  add_index "assignments", ["source"], name: "index_assignments_on_source", using: :btree

  create_table "attachments", force: true do |t|
    t.integer  "purchase_id"
    t.string   "attachment_file_name"
    t.string   "attachment_content_type"
    t.integer  "attachment_file_size"
    t.datetime "attachment_updated_at"
    t.string   "last_user"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "attachments", ["purchase_id"], name: "index_attachments_on_purchase_id", using: :btree

  create_table "line_items", force: true do |t|
    t.integer  "purchase_id"
    t.string   "sku"
    t.string   "description"
    t.string   "unit"
    t.integer  "quantity"
    t.decimal  "price",       precision: 8, scale: 2
    t.string   "last_user"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "line_items", ["purchase_id"], name: "index_line_items_on_purchase_id", using: :btree

  create_table "notes", force: true do |t|
    t.string   "note"
    t.string   "last_user"
    t.integer  "purchase_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "notes", ["purchase_id"], name: "index_notes_on_purchase_id", using: :btree

  create_table "purchase_to_tags", force: true do |t|
    t.integer "purchase_id"
    t.integer "tag_id"
  end

  add_index "purchase_to_tags", ["purchase_id"], name: "index_purchase_to_tags_on_purchase_id", using: :btree
  add_index "purchase_to_tags", ["tag_id"], name: "index_purchase_to_tags_on_tag_id", using: :btree

  create_table "purchase_to_vendors", force: true do |t|
    t.integer "purchase_id"
    t.integer "vendor_id"
  end

  add_index "purchase_to_vendors", ["purchase_id"], name: "index_purchase_to_vendors_on_purchase_id", using: :btree
  add_index "purchase_to_vendors", ["vendor_id"], name: "index_purchase_to_vendors_on_vendor_id", using: :btree

  create_table "purchases", force: true do |t|
    t.integer  "buyer_id"
    t.integer  "requester_id"
    t.integer  "recipient_id"
    t.integer  "account_id"
    t.string   "tracking_num"
    t.string   "approved_by"
    t.decimal  "labor",           precision: 8, scale: 2, default: 0.0
    t.decimal  "shipping",        precision: 8, scale: 2, default: 0.0
    t.decimal  "tax_rate",        precision: 8, scale: 2, default: 0.0
    t.date     "date_approved"
    t.date     "date_requested"
    t.date     "date_purchased"
    t.date     "date_expected"
    t.date     "date_required"
    t.date     "date_received"
    t.date     "date_reconciled"
    t.date     "starred"
    t.string   "last_user"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "purchases", ["account_id"], name: "index_purchases_on_account_id", using: :btree
  add_index "purchases", ["buyer_id"], name: "index_purchases_on_buyer_id", using: :btree
  add_index "purchases", ["recipient_id"], name: "index_purchases_on_recipient_id", using: :btree
  add_index "purchases", ["requester_id"], name: "index_purchases_on_requester_id", using: :btree

  create_table "receiving_lines", force: true do |t|
    t.integer  "line_item_id"
    t.integer  "receiving_id"
    t.integer  "quantity"
    t.string   "last_user"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "receiving_lines", ["line_item_id"], name: "index_receiving_lines_on_line_item_id", using: :btree
  add_index "receiving_lines", ["receiving_id"], name: "index_receiving_lines_on_receiving_id", using: :btree

  create_table "receivings", force: true do |t|
    t.integer  "purchase_id"
    t.integer  "total"
    t.string   "last_user"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "receivings", ["purchase_id"], name: "index_receivings_on_purchase_id", using: :btree

  create_table "roles", force: true do |t|
    t.string "name", null: false
  end

  add_index "roles", ["name"], name: "index_roles_on_name", using: :btree

  create_table "sessions", force: true do |t|
    t.string   "session_id", null: false
    t.string   "cas_ticket"
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["cas_ticket"], name: "index_sessions_on_cas_ticket", using: :btree
  add_index "sessions", ["session_id"], name: "index_sessions_on_session_id", using: :btree
  add_index "sessions", ["updated_at"], name: "index_sessions_on_updated_at", using: :btree

  create_table "tags", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "username"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "title"
    t.string   "email"
    t.string   "department"
    t.integer  "phone"
    t.string   "photo_url"
    t.datetime "current_login_at"
    t.datetime "last_login_at"
    t.integer  "login_count"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "department_id"
  end

  add_index "users", ["department_id"], name: "index_users_on_department_id", using: :btree
  add_index "users", ["email"], name: "index_users_on_email", using: :btree
  add_index "users", ["first_name", "last_name"], name: "index_users_on_first_name_and_last_name", using: :btree
  add_index "users", ["first_name"], name: "index_users_on_first_name", using: :btree
  add_index "users", ["last_name", "first_name"], name: "index_users_on_last_name_and_first_name", using: :btree
  add_index "users", ["last_name"], name: "index_users_on_last_name", using: :btree
  add_index "users", ["username"], name: "index_users_on_username", using: :btree

  create_table "vendors", force: true do |t|
    t.string   "name"
    t.string   "website"
    t.string   "email"
    t.string   "address"
    t.string   "city"
    t.string   "state"
    t.string   "zip_code"
    t.string   "country"
    t.string   "phone"
    t.string   "fax"
    t.string   "account_num"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
