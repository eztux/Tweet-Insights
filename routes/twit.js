let express = require('express')
var router = express.Router();

let keys = require('../keys.js').twitter

let Twit = require('twit')
let Sentiment = require('sentiment')

let sentiment = new Sentiment()

var T = new Twit({
    consumer_key:         keys.consumer_key,
    consumer_secret:      keys.consumer_secret_key,
    access_token:         keys.access_token,
    access_token_secret:  keys.access_token_secret,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

router.get('/', (req, res) => {
    T.get('statuses/show/:id', { id: '1252462885579694080' }, function(err, data, response) {
        let result = sentiment.analyze(data.text)
        res.send(result)
    })
})

module.exports = router;
