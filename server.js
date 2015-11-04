// server.js
// Peter Soboyejo
// http://www.github.com/dzt


var request = require('request'),
    cheerio = require('cheerio'),
    express = require('express'),
    fs = require('fs'),
    open = require('open'),
    Crawler = require('simplecrawler'),
    app = express();

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

            console.log("Latest Product: ", title);

            /*
            fs.readFile('output.json', function(err, data) {

              if (err) throw err;
              var obj = JSON.parse(data);
              if (obj != parsedResults) {


                  console.log("Something has changed");

                  // TODO: twilio, nodemailer, gcm 

              }
            });
            */

            fs.writeFile('output.json', JSON.stringify(parsedResults, null, 4), function (error) {
                console.log('Output file successfully written');
            });

            if (availability == "") availability = "Available";

            var metadata = {
              title: title,
              itemLink: itemLink,
              imageLink: imageLink,
              availability: availability
            };

            parsedResults.push(JSON.stringify(metadata));

          });
          
          // res.json(JSON.stringify(parsedResults));

        }
  });
});



app.get('/', function(req, res) {

    res.redirect('/api/v1/');

});

app.get('/api/v1/', function(req, res) {

    res.send('( ͡° ͜ʖ ͡°) are you looking for <a href="/api/v1/scrape">this</a>?');
    
});

app.get('/api/v1/scrape', function(req, res) {

    res.sendFile(__dirname + '/output.json');
    
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  // open('http://localhost:'+this.address().port+'/');
});
