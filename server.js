// server.js
// Peter Soboyejo
// http://www.github.com/dzt

var request = require('request'),
    cheerio = require('cheerio'),
    twilio = require('twilio'),
    express = require('express'),
    Parse = require('parse/node'),
    fs = require('fs'),
    client = require('twilio'),
    ejs =  require('ejs'),
    io = require('socket.io'),
    open = require('open'),
    Crawler = require('simplecrawler'),
    md5 = require('md5'),
    app = express();

app.set('view engine','ejs');

Parse.initialize(
    process.env.PARSE_APPID, // applicationId
    process.env.PARSE_JSKEY, // javaScriptKey
    process.env.PARSE_MASTERKEY // masterKey
);

var url = "http://www.supremenewyork.com/shop/all";
var crawler = Crawler.crawl(url);
crawler.interval = 10000;
crawler.maxConcurrency = 1;

String.prototype.capitalizeEachWord = function() {
    return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

crawler.on("fetchcomplete", function (queueItem) {
    request(url, function(err, resp, html, rrr, body) {
        // Successful request
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(html);

            var parsedResults = {
                items: []
            };

            $('img').each(function(i, element) {

                var nextElement = $(this).next();
                var prevElement = $(this).prev();
                var image = "https://" + $(this).attr('src').substring(2);
                var title = $(this).attr('alt');
                var availability = nextElement.text().capitalizeEachWord();

                var link = "http://www.supremenewyork.com" + this.parent.attribs.href;

                if (availability == "") availability = "Available";

                // Scrapes an items product page for: images, price, description, and style. It then writes to output.json
                request(link, function(err, resp, html, rrr, body) {

                    fs.writeFile('output.json', JSON.stringify(parsedResults, null, 4), function(err) {

                    });

                    var $ = cheerio.load(html);

                    var metadata = {
                        id: md5(title + $('.style').attr('itemprop', 'model').text()),
                        title: title,
                        style: $('.style').attr('itemprop', 'model').text(),
                        link: link,
                        description: $('.description').text(),
                        price: parseInt(($('.price')[0].children[0].children[0].data).replace('$', '').replace(',', '')),
                        image: image,
                        images: [],
                        availability: availability
                    };

                    // Some items don't have extra images (like some of the skateboards)
                    if ($('.styles').length > 0) {
                        var styles = $('.styles')[0].children;
                        for (li in styles) {
                            for (a in styles[li].children) {
                                if (styles[li].children[a].attribs['data-style-name'] == metadata.style) {
                                    metadata.images.push('https:' + JSON.parse(styles[li].children[a].attribs['data-images']).zoomed_url)
                                }
                            }
                        }
                    } else if (title.indexOf('Skateboard') != -1) {
                        // Because fuck skateboards
                        metadata.images.push('https:' + $('#img-main').attr('src'))
                    }

                    // console.log(metadata);
                    parsedResults.items.push(metadata);
                })

            });
        } else if (err && resp.statusCode != 200) {
            console.log("Error: " + err + "\n with status code: " + resp.statusCode);
        } else {
            console.log("Unknown error");
        }
    });
});

var url2 = "http://www.supremenewyork.com/shop/all";
var crawler2 = Crawler.crawl(url2);
crawler2.interval = 10000;
crawler2.maxConcurrency = 1;

crawler2.on("fetchcomplete", function (queueItem) {
    request(url2, function(error, response, html) {

    var latestItem;
    var json = {
        latestItem: ""
    };

    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);

        var latestItem = $('img:first-child').attr('alt');
        console.log(latestItem);

            json.latestItem = latestItem;
            console.log(json);

            fs.readFile('latestItem.json', function(err, data) {
                if (err) {
                    throw err;
                }
                var obj = JSON.parse(data);
                if (obj.latestItem != latestItem) {
                    console.log('Item Name has changed.');
                    fs.writeFile('latestItem.json', JSON.stringify(json, null, 4), function(err) {
                        console.log('Item Name saved in latestItem.json file');
                    });
                }
                if (obj.latestItem != latestItem) {

                    console.log("Item name has changed sending push notification...");
                    Parse.Push.send({
                     where: new Parse.Query(Parse.Installation),
                     data: {
                          alert: "New Drop: " + obj.latestItem
                        }
                    });

                }
            });
    }

    });
});


app.get('/', function(req, res) {
    res.render('index');
});

app.get('/api/v1/items/recentlyadded', function(req, res) {

    res.send('<b>Coming Soon</b>');


    // TODO - save to recent.json
    /*

    Schema: JSON
    [
        {

            "name": "Some Item Name",
            "style": "Print",
            "timeAdded": "2015-12-22 14:00:00"

        }


    ]
    */

});

/*
 *
 *  API endpoints
 *
 */

// Get an item by its id
app.get('/api/v1/item/id', function(req, res) {
    fs.readFile('output.json', function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        var ret;
        for (i in data) {
            if (data[i].id == req.query.id) {
                ret = data[i];
            }
        }
        if (ret == NaN || ret == undefined || ret == null) ret = "No Results";
        res.send(JSON.stringify(ret));
    });
})

// Get item by it's link
app.get('/api/v1/item/link', function(req, res) {
    fs.readFile('output.json', function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        var ret;
        for (i in data) {
            if (data[i].link == req.query.link) {
                ret = data[i];
            }
        }
        if (ret == NaN || ret == undefined || ret == null) ret = "No Results";
        res.send(JSON.stringify(ret));
    });
});

// Get items by thier title
app.get('/api/v1/items/title', function(req, res) {
    fs.readFile('output.json', function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        var ret = [];
        for (i in data) {
            if (data[i].title == req.query.title) {
                ret.push(data[i]);
            }
        }
        if (ret == NaN || ret == undefined || ret == null || ret.lenght == 0) ret = "No Results";
        res.send(JSON.stringify(ret));
    });
});

// Get items by their availability
app.get('/api/v1/items/availability', function(req, res) {
    fs.readFile('output.json', function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        var ret = [];
        for (i in data) {
            if (data[i].availability == req.query.availability) {
                ret.push(data[i]);
            }
        }
        if (ret == NaN || ret == undefined || ret == null || ret.length == 0) ret = "No Results";
        res.send(JSON.stringify(ret));
    });
});

// Get ALL items
app.get('/api/v1/items/all', function(req, res) {
    fs.readFile('output.json', function(err, data) {
        res.send(JSON.parse(data));
    });
});

/*
 *  END API ENDPOINTS
 */

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
