# PremeFeed Server

Backend for PremeFeed services. The server implements an API service and *eventually* a subscription service.

Created by <a href="https://github.com/dzt/">Peter</a>, <a href="https://github.com/10Frank10/">Frank</a>, <a href="https://github.com/cryptoc1">Sam</a>, and some help from <a href="https://github.com/trommel">Josh</a>.

### API/Structure

The API works similarly to any other REST API. However, because I'm lazy, the endpoints can seem a little redundant. We'll get to that though. Information on each endpoint will be updated frequently below.

<br>

##### `/api/v1/item/title`
Returns an item by its title.

URL parameters:

* title    :   The title of the item to find

Example:

`GET: premefeed.herokuapp.com/api/v1/item/title?title=Child of hell keychain`

Data Returned:
```JSON
{
    "title": "Child of hell keychain",
    "style": "Leather",
    "link": "http://www.supremenewyork.com/shop/accessories/child-of-hell-keychain/leather",
    "description": "Leather with debossed graphic on front, printed graphic on back and 1” key ring.",
    "price": "$10",
    "images": ["http://d17ol771963kd3.cloudfront.net/110188/zo/w3Qw30JB9xE.jpg", "http://d17ol771963kd3.cloudfront.net/110190/zo/wFmXjoex5HA.jpg"],
    "availability":"Available"
}
```

<br>

##### `/api/v1/item/link`
Returns an item by its link.

URL parameters:

* link  :   Link of the item to find

Example:    

`GET: premefeed.herokuapp.com/api/v1/item/link?link=http://www.supremenewyork.com/shop/accessories/child-of-hell-keychain/leather`

Data Returned:
```JSON
{
    "title": "Child of hell keychain",
    "style": "Leather",
    "link": "http://www.supremenewyork.com/shop/accessories/child-of-hell-keychain/leather",
    "description": "Leather with debossed graphic on front, printed graphic on back and 1” key ring.",
    "price": "$10",
    "images": ["http://d17ol771963kd3.cloudfront.net/110188/zo/w3Qw30JB9xE.jpg", "http://d17ol771963kd3.cloudfront.net/110190/zo/wFmXjoex5HA.jpg"],
    "availability":"Available"
}
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
        "title": "Child of hell keychain",
        "style": "Leather",
        "link": "http://www.supremenewyork.com/shop/accessories/child-of-hell-keychain/leather",
        "description": "Leather with debossed graphic on front, printed graphic on back and 1” key ring.",
        "price": "$10",
        "images": ["http://d17ol771963kd3.cloudfront.net/110188/zo/w3Qw30JB9xE.jpg", "http://d17ol771963kd3.cloudfront.net/110190/zo/wFmXjoex5HA.jpg"],
        "availability":"Available"
    },
    {
        ...
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
