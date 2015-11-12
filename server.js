// server.js
// Peter Soboyejo
// http://www.github.com/dzt

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
var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
var client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
app.set('view engine','ejs');
dotenv.load();

var url = "http://www.supremenewyork.com/shop/all";

var crawler = Crawler.crawl(url);
crawler.interval = 10000;
crawler.maxConcurrency = 1;

var mins = 0.05,
    interval_a = mins * 60 * 1000



crawler.on("fetchcomplete", function (queueItem) {

// Make a GET Request under '/collect' that retunrs JSON data of
  request(url, function(err, resp, html, rrr, body) {

        /*

        When making a request to the site if it retunrs back a response of 200 then

        */

        String.prototype.capitalizeEachWord = function()
        {
            return this.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }

        if (!err && resp.statusCode == 200) {

          var $ = cheerio.load(html);
          var parsedResults = [];

          $('img').each(function(i, element) {

            var nextElement = $(this).next();
            var prevElement = $(this).prev();

            var title = $(this).attr('alt');
            var imageLink = "http://" + $(this).attr('src').substring(2);
            var availability = nextElement.text().capitalizeEachWord();
            var itemLink = "http://www.supremenewyork.com" + $('#container').find('a').attr('href');


          fs.writeFile('output.json', JSON.stringify(parsedResults, null, 4), function(err) {

              // console.log('File successfully written! - Check your project directory for the output.json file');

          });


          console.log(parsedResults);


            if (availability == "") availability = "Available";

            var metadata = {

              title: title,
              itemLink: itemLink,
              imageLink: imageLink,
              availability: availability

            };

            fs.readFile('output.json', function(err, data) {
                if (err) throw err;
                var obj = JSON.parse(data);
                if (obj != parsedResults) {
                    console.log('Something has changed.');
              }
            });

            parsedResults.push(metadata);

          });

        }
  });
});



app.get('/', function(req, res) {

    res.send('<a href="/scrape">Click here to get some data</a></br><a href="http://dzt.github.io/premefeed/">GitHub</a>');

});

app.get('/scrape', function(req, res) {

    res.sendFile(__dirname + '/output.json');

});

app.post('/sms_subscribe', function(req, res) {

    // My Twilio number +1 (609)-917-7050
    // Idea - To Text "Subscribe" to get updates on the latest updates
    // SUBSCRIBE: Text Command
    // UNSUBSCRIBE: Text Command

    // TODO: Twilio Stuff

});

app.get('/chart', function (req, res) {

    // TODO: Socket.io Config/Setup

    res.render('chart');

});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  // open('http://localhost:'+this.address().port+'/');
});
