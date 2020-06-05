Table orders {
  id int [pk]
  active_order int
  open boolean
  caller string
  collector string
  collecttime string
  datestring string
	created_at timestamp
	updated_at timestamp
}

Table orders_ingredients {
  id int [pk]
  ingredients_id int
  orders_id int
  created_at timestamp
	updated_at timestamp
}

Table orders_meals {
  id int [pk]
  meals_id int
  orders_id int
  created_at timestamp
	updated_at timestamp
}

Table orders_users {
  id int [pk]
  orders_id int
  users_id uuid
  prepaid double
  created_at timestamp
	updated_at timestamp
}

Table meals {
  id int [pk]
  name string
  price double
  created_at timestamp
	updated_at timestamp
}

Table meals_ingredients {
  id int [pk]
  meals_id int
  ingredients_id int
  created_at timestamp
	updated_at timestamp
}

Table ingredients {
  id int [pk]
  name string
  price double
  created_at timestamp
	updated_at timestamp
}

Table users {
  id uuid [pk]
  username string
  displayname string
  password string
  email string
  created_at timestamp
	updated_at timestamp
}

Table config {
  id int [pk]
  active_order int
  created_at timestamp
	updated_at timestamp
}

Ref: orders.id      < orders_ingredients.orders_id
Ref: ingredients.id < orders_ingredients.ingredients_id

Ref: orders.id      < orders_meals.orders_id
Ref: meals.id       < orders_meals.meals_id

Ref: orders.id      < orders_users.orders_id
Ref: users.id       < orders_users.users_id

Ref: meals.id       < meals_ingredients.meals_id
Ref: ingredients.id < meals_ingredients.ingredients_id

Ref: orders.active_order - config.active_order
