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
    // T.get('statuses/show/:id', { id: '1252462885579694080' }, function(err, data, response) {
    //     let result = sentiment.analyze(data.text)
    //     res.send(result)
    // })

    res.sendFile('C:/Users/shamu/Desktop/death-project/Tweet-Insights/public/test.html')
})

router.get('/:id', (req, res) => {
    T.get('statuses/show/:id', { id: req.params.id }, function(err, data, response) {
        let result = sentiment.analyze(data.text)
        res.send(result)
    })
})

router.post('/twitterPost', (req, res) => {
    console.log(req.body.url)
    let re = /https:\/\/(twitter)\.com\/([a-zA-Z0-9_.-]+)\/(status)\/([0-9]+)/g

    let arr = re.exec(req.body.url)

    console.log(arr)

    res.redirect(`${arr[4]}`)
})

module.exports = router;
