# syncOrder

Happy cloning and forking!

## Get Started - tldr;

```
git clone https://github.com/rabalyn/syncOrder.git
cd syncOrder/backend
npm install
npm start
cd ../frontend
npm run install
npm run serve
```

## What you get

A simple express-app backend with vue/vue-bootstrap frontend to coordinate ordering in your office. The text is hard coded in german and there is the menu card of our weekly pizza delivery.

You are welcome to customize for your needs :)

The textfields and table are updated in realtime via websockets - thank you [socket.io](https://socket.io/)!

## Structure of data JSON files

The data serialized every 5 minutes to the \*.json files in the \$root/data directory

Structure of the files:

```
const metaObj = {
    "dateString":"2019-06-13",
    "caller":"foo",
    "collector":"bar",
    "collectTime":"12:22"
}
```

The data is stupidly populated.
The structure of the object is

```
const paied = [
  "15",   // first order
  0,      // second order
  null    // 'sum' row
]
```

The orders are not stored on every change, only when the user is saving / updating the order:

```
const orders = [
    {
        "name": "test",
        "meal": "Margherita",
        "mealPrice": 7,
        "extras": [
            {
                "number": 4,
                "name": "Parmaschinken",
                "ingredients": [
                    "Parmaschinken"
                ],
                "price": 2,
                "type": "add"
            },
            {
                "number": 1,
                "name": "Gorgonzola",
                "ingredients": [
                    "Gorgonzola"
                ],
                "price": 1.5,
                "type": "add"
            },
            {
                "name": "ohne Käse",
                "price": "",
                "type": "remove"
            }
        ],
        "extrasPrice": 3.5,
        "orderId": 1
    },
    {
        "name": "test2",
        "meal": "Frutti di Mare",
        "mealPrice": 9.8,
        "extras": [],
        "extrasPrice": 0,
        "orderId": 2
    }
]
```

Number of the next table row.

```
const tableId = 9
```
