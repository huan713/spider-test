var express = require('express');
var router = express.Router();
// var superagent = require('superagent');
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');

var count = 0

var requestPage = (res) => {
  request('http://web.jobbole.com/', (err, response, body) => {
    if (!err && response.statusCode === 200) {
      count ++;
      var $ = cheerio.load(body)
      var items = [];
      $('.meta-title').each(function (index, element) {
        var $element = $(element);
        items.push({
          href: $element.attr('href'),
          text: $element.text()
        });
      });
      if (items.length > 0) {
        res.render('index', { title: 'Express', items: items });
      } else if (items.length === 0 && count > 5) {
        console.log('请求失败')
      } else {
         requestPage(res)
      }
    } else {
      console.log(err)
    }
  })
}

/* GET home page. */
router.get('/', function(req, res, next) {
  count = 0;
  requestPage(res)
});

module.exports = router;
