# PremeFeed Server

Backend for PremeFeed services. The server implements an API service and *eventually* a subscription service.

Created by <a href="https://github.com/dzt/">Peter</a>, <a href="https://github.com/10Frank10/">Frank</a>, and <a href="https://github.com/cryptoc1">Sam</a>.

### API/Structure

The API works similarly to any other REST API. However, because I'm lazy, the endpoints can seem a little redundant. We'll get to that though. Information on each endpoint will be updated frequently below.

<br>

##### `/api/v1/item/id`
Returns an item by its id. An `id` is an item's `title` and `style` md5 hashed together (`server.js, line: 65`).

URL parameters:

* id    :   The id of the item to find

Example:

`GET: premefeed.herokuapp.com/api/v1/item/id?id=7c6f6661981ce08f4851dddf37c8d086`

Data Returned:
```JSON
{
    "id": "7c6f6661981ce08f4851dddf37c8d086",
    "title": "Polartec® Fleece Pant",
    "style": "Medium Blue",
    "link": "http://www.supremenewyork.com/shop/pants/polartec-fleece-pant/medium-blue",
    "description": "Polartec® 200 fleece. Front slash pockets, single back zip pocket, and elastic waistband and cuffs. Embroidered logo on back pocket.",
    "price": 128,
    "images": ["http://d17ol771963kd3.cloudfront.net/109158/zo/3u8uwZ7UgJA.jpg","http://d17ol771963kd3.cloudfront.net/110960/zo/6ufa2O6Lhx0.jpg"],
    "availability": "Available"
},

```

<br>

##### `/api/v1/item/link`
Returns an item by its link.

URL parameters:

* link  :   Link of the item to find

Example:    

`GET: premefeed.herokuapp.com/api/v1/item/link?link=http://www.supremenewyork.com/shop/pants/polartec-fleece-pant/medium-blue`

Data Returned:
```JSON
{
    "id": "7c6f6661981ce08f4851dddf37c8d086",
    "title": "Polartec® Fleece Pant",
    "style": "Medium Blue",
    "link": "http://www.supremenewyork.com/shop/pants/polartec-fleece-pant/medium-blue",
    "description": "Polartec® 200 fleece. Front slash pockets, single back zip pocket, and elastic waistband and cuffs. Embroidered logo on back pocket.",
    "price": 128,
    "images": ["http://d17ol771963kd3.cloudfront.net/109158/zo/3u8uwZ7UgJA.jpg", "http://d17ol771963kd3.cloudfront.net/110960/zo/6ufa2O6Lhx0.jpg"],
    "availability": "Available"
}
```

<br>

##### `/api/v1/items/title`
Returns an array of items by their title.

URL parameters:

* title    :   The title of the items to find

Example:

`GET: premefeed.herokuapp.com/api/v1/item/title?title=Polartec® Fleece Pant`

Data Returned:
```JSON
[
    {
        "id": "7c6f6661981ce08f4851dddf37c8d086",
        "title": "Polartec® Fleece Pant",
        "style": "Medium Blue",
        "link": "http://www.supremenewyork.com/shop/pants/polartec-fleece-pant/medium-blue",
        "description": "Polartec® 200 fleece. Front slash pockets, single back zip pocket, and elastic waistband and cuffs. Embroidered logo on back pocket.",
        "price": 128,
        "images": ["http://d17ol771963kd3.cloudfront.net/109158/zo/3u8uwZ7UgJA.jpg","http://d17ol771963kd3.cloudfront.net/110960/zo/6ufa2O6Lhx0.jpg"],
        "availability": "Available"
    },
    ...
]
```

<br>

##### `/api/v1/items/availability`
Returns an array of items by their availability.

URL parameters:

* availability  :   Availability of the items to find (can be `Available` or `Sold Out`)

Example:

`GET: premefeed.herokuapp.com/api/v1/items/availability?availability=Available`

Data Returned:
```JSON
[
    {
        "id": "7c6f6661981ce08f4851dddf37c8d086",
        "title": "Polartec® Fleece Pant",
        "style": "Medium Blue",
        "link": "http://www.supremenewyork.com/shop/pants/polartec-fleece-pant/medium-blue",
        "description": "Polartec® 200 fleece. Front slash pockets, single back zip pocket, and elastic waistband and cuffs. Embroidered logo on back pocket.",
        "price": 128,
        "images": ["http://d17ol771963kd3.cloudfront.net/109158/zo/3u8uwZ7UgJA.jpg","http://d17ol771963kd3.cloudfront.net/110960/zo/6ufa2O6Lhx0.jpg"],
        "availability": "Available"
    },
    ...
]
```

<br>

##### `/api/v1/items/all`
Returns an array of all items in the Database.

URL parameters:

None

Example:

`GET: premefeed.herokuapp.com/api/v1/items/all`

 Data Returned:
 ```JSON
[
    {
        ...
    },
    {
        ...
    },
    ...
]
 ```

<br>
<br>
<br>

<a href="http://premefeed.herokuapp.com/" target="\_blank">Check it Out</a>
