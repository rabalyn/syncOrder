# syncOrder

Happy cloning and forking!

## Get Started - tldr;

```
git clone https://github.com/rabalyn/syncOrder.git
cd syncOrder
npm install
npm start
```

## What you get

A simple express-app with bootstrap frontend to coordinate ordering in your office. The text is hard coded in german and there is the menu card of our weekly pizza delivery.

You are welcome to customize for your needs :)

The textfields and table are updated in realtime via websockets - thank you [socket.io](https://socket.io/)!

## Structure of data JSON files

The data is stupidly populated and never updated - all new values (as objects) are simply appended.
The structure of the object is
```
const metaObj = {
    "id": "$htmlElementId",
    "text": "$inputValue"
}
```
```
const meta = [
    {
        "id": "inputCollector",
        "text": "F"
    },
    {
        "id": "inputCollector",
        "text": "Fo"
    },
    {
        "id": "inputCollector",
        "text": "Foo"
    },
    {
        "id": "inputName",
        "text": "B"
    },
    {
        "id": "inputName",
        "text": "Ba"
    },
    {
        "id": "inputName",
        "text": "Bar"
    }
]
```

The data is stupidly populated and never updated - all new values (as objects) are simply appended.
The structure of the object is
```
const paiedObj = {
    "id": {},
    "htmlid": "$Name$mealNumber $mealnamenull",
    "paied": "$amount"
}
```
```
const paied = [
    {
        "id": {},
        "htmlid": "Foo1 Pizza2null",
        "paied": "1"
    },
    {
        "id": {},
        "htmlid": "Foo1 Pizza2null",
        "paied": "10"
    },
    {
        "id": {},
        "htmlid": "Foo1 Pizza2null",
        "paied": "100"
    },
    {
        "id": {},
        "htmlid": "Foo1 Pizza2null",
        "paied": "10"
    },
    {
        "id": {},
        "htmlid": "Bar7 Salad16null",
        "paied": "5"
    }
]
```

The orders are not stored on every change, only when the user is saving the order:
```
const ordersObj = {
    "name": "$name",
    "meal": "$mealnumber $mealName",
    "size": null, // not used for DaVinci
    "extras": "Object Array with chosen extras || null",
    "price": "$priceString",
    "tableId": 1
}
```
```
const orders = [
    {
        "name": "Foo",
        "meal": "1 Pizza",
        "size": null, // not used for DaVinci
        "extras": "[{\"category\":\"Extras\",\"number\":\"5\",\"name\":\"Zwiebeln\",\"ingredients\":\"Zwiebeln\",\"price\":\"0.5\"}]",
        "price": "9.00€",
        "tableId": 1
    },
    {
        "name": "Bar",
        "meal": "7 Salad",
        "size": null,
        "extras": "null",
        "price": "7.50€",
        "tableId": 2
    }
]
```

Number of the next table row.
```
const tableId = 9
```

