Table orders {
  id int [
    pk,
    ref: < orders_extras.orders_id,
    ref: < orders_ingredients.orders_id]
	orderid int
	name string
	meal string
	mealprice double
	extrasprice double
	created_at timestamp
	updated_at timestamp
}

Table orders_extras {
  id int [pk]
  extras_id int
  orders_id int
  created_at timestamp
	updated_at timestamp
}


Table extras {
  id int [
    pk,
    ref: < orders_extras.extras_id]
  name string
  price double
  created_at timestamp
	updated_at timestamp
}

Table orders_ingredients {
  id int [pk]
  orders_id int
  ingredients_id int
  created_at timestamp
	updated_at timestamp
}

Table ingredients {
  id int [
    pk,
    ref: < orders_ingredients.ingredients_id]
  name string
  price double
  created_at timestamp
	updated_at timestamp
}

Table meta {
  id int [pk]
  caller string
  collector string
  collecttime string
  datestring string
  created_at timestamp
  updated_at timestamp
}
