var request = require('request'),
    cheerio = require('cheerio'),
    express = require('express'),
    fs = require('fs'),
    open = require('open'),
    app = express();


// Make a GET Request under '/collect' that retunrs JSON data of
app.get('/api/v1/scrape', function(req, res) {
  request('http://www.supremenewyork.com/shop/all', function(err, resp, html, rrr, body) {

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

            if (availability == "") availability = "Available";

            var metadata = {
              title: title,
              itemLink: itemLink,
              imageLink: imageLink,
              availability: availability
            };
            parsedResults.push(JSON.stringify(metadata));
          });
          console.log(JSON.stringify(parsedResults));
          res.send(JSON.stringify(parsedResults));
        }
  });
});

app.get('/', function(req, res) {

    res.redirect('/api/v1/');

});

app.get('/api/v1/', function(req, res) {

    res.send('( ͡° ͜ʖ ͡°) are you looking for <a href="/api/v1/scrape">this</a>?');
    
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  open('http://localhost:'+this.address().port+'/');
});
