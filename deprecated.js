var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

	url = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String';

	request(url, function(error, response, html){
		if(!error){

			var $ = cheerio.load(html)
			var json = [];
			var nameOfMethod = "";
			var count = $('.quick-links').find($('.icon-thumbs-down-alt')).length;

		for (var i = 0; i < count; i++) {
					json[i] = { nameOfMethod:""};
					nameOfMethod = $('.icon-thumbs-down-alt').closest('li').eq(i).text();
					json[i].nameOfMethod = nameOfMethod;
				};

		}


		fs.writeFile('output.json', JSON.stringify(json, null, 1), function(err){
        	console.log('File successfully written! - Check your project directory for the output.json file');
        });

	});
