// server.js
// Peter Soboyejo
// http://www.github.com/dzt

// Last modified: 12/20/2015, @cryptoc1

var request = require('request'),
    cheerio = require('cheerio'),
    twilio = require('twilio'),
    express = require('express'),
    fs = require('fs'),
    client = require('twilio'),
    ejs =  require('ejs'),
    io = require('socket.io'),
    open = require('open'),
    Crawler = require('simplecrawler'),
    app = express();

// app config stuff
// I commented this shit so that I could test locally -sam
/*
var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
var client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);*/
app.set('view engine','ejs');

var url = "http://www.supremenewyork.com/shop/all";

var crawler = Crawler.crawl(url);
crawler.interval = 10000;
crawler.maxConcurrency = 1;

var mins = 0.05,
    interval_a = mins * 60 * 1000

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
            var parsedResults = [];

            $('img').each(function(i, element) {
                var nextElement = $(this).next();
                var prevElement = $(this).prev();

                var title = $(this).attr('alt');
                var imageLink = "http://" + $(this).attr('src').substring(2);
                var availability = nextElement.text().capitalizeEachWord();
                var itemLink = "http://www.supremenewyork.com" + this.parent.attribs.href;

                if (availability == "") availability = "Available";

                // Scrapes an items product page for: images, price, description, and style. It then writes to output.json
                request(itemLink, function(err, resp, html, rrr, body) {
                    fs.writeFile('output.json', JSON.stringify(parsedResults, null, 4), function(err) {
                        if (err) console.log(err);
                    });

                    var $ = cheerio.load(html);

                    var metadata = {
                        title: title,
                        style: $('.style').attr('itemprop', 'model').text(),
                        itemLink: itemLink,
                        description: $('.description').text(),
                        price: $('.price')[0].children[0].children[0].data,
                        images: [],
                        availability: availability
                    };

                    // Some items don't have extra images (like some of the skateboards)
                    if ($('.styles').length > 0) {
                        var styles = $('.styles')[0].children;
                        for (li in styles) {
                            for (a in styles[li].children) {
                                if (styles[li].children[a].attribs['data-style-name'] == metadata.style) {
                                    metadata.images.push('http:' + JSON.parse(styles[li].children[a].attribs['data-images']).zoomed_url)
                                }
                            }
                        }
                    }

                    parsedResults.push(metadata);
                })

                // Do we need this shit? Only need I see is for detecting when Supreme makes changes, so that we can send out notifications -sam

                /*fs.readFile('output.json', function(err, data) {
                    if (err) throw err;
                    var obj = JSON.parse(data);
                    if (obj != parsedResults) {
                        console.log('Something has changed.');
                  }
              });*/
            });
        } else if (err && resp.statusCode != 200) {
            console.log("Error: " + err + "\n with status code: " + resp.statusCode);
        } else {
            console.log("Unknown error");
        }
    });
});


app.get('/', function(req, res) {
    res.send('<a href="/api/items/all">Click here to get some data</a></br><a href="http://premefeed.github.io/">GitHub</a>');
});

// Deprecated & replaced by /api/items/all
/*app.get('/scrape', function(req, res) {
    res.sendFile(__dirname + '/output.json');
});*/


/*
 *
 *  API endpoints
 *  Added: 12/20/15, @cryptoc1
 *
 */

// Get item by it's title
app.get('/api/item/title', function(req, res) {
    fs.readFile('output.json', function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        var ret;
        for (i in data) {
            if (data[i].title == req.query.title) {
                ret = data[i];
            }
        }
        if (ret == NaN || ret == undefined || ret == null) ret = "No Results";
        res.send(JSON.stringify(ret));
    });
});

// Get item by it's link
app.get('/api/item/link', function(req, res) {
    fs.readFile('output.json', function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        var ret;
        for (i in data) {
            if (data[i].itemLink == req.query.link) {
                ret = data[i];
            }
        }
        if (ret == NaN || ret == undefined || ret == null) ret = "No Results";
        res.send(JSON.stringify(ret));
    });
});

// Get items by their availability
app.get('/api/items/availability', function(req, res) {
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
app.get('/api/items/all', function(req, res) {
    fs.readFile('output.json', function(err, data) {
        res.send(JSON.parse(data));
    });
});

/*
 *  END API ENDPOINTS
 */


// Commented out, so that I could locally test shit. -sam
/*
app.post('/sms_subscribe', function(req, res) {
    setTimeout(function(){
        try {
            SendMessage(req.body.phoneNumber, function(result){
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify({"success": true}));
            });
        } catch (err) {
            console.log(err);
        }
    }, 5000);
});

function SendMessage(phoneNumber, callback) {
    if (phoneNumber[0] !== "1") {
        phoneNumber = "1" + phoneNumber;
    }
    client.sendSms({
        to: '+'+phoneNumber,
        from: process.env.TWILIO_NUMBER,
        body: "Gang Gang" +
            " - Peter "
    }, function(err, responseData){
        console.log(err);
        callback(responseData);
    });
}

// What is this? -sam
app.get('/chart', function (req, res) {
    // TODO: Socket.io Config/Setup
    res.render('chart');
});*/

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    // open('http://localhost:'+this.address().port+'/');
});
