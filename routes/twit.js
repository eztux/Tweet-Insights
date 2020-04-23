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

router.get('/tweet/:id', (req, res) => {
    T.get('statuses/show/:id', { id: req.params.id }, function(err, data, response) {
        let result = sentiment.analyze(data.text)
        console.log(data)
        res.send(data)
    })
})

router.get('/replies/:id', (req, res) => {
    T.get('search/tweets', { q: `in_reply_to_status_id:${req.params.id}` }, function(err, data, response) {
        // let result = sentiment.analyze(data.text)
        console.log(data)
        res.send(data)

    })
})

router.get('/user/:id', (req, res) => {
    // Make sure we count no retweets
    T.get('search/tweets', { q: `from:${req.params.id}`, count: 100 }, function(err, data, response) {
        // let result = sentiment.analyze(data.text)
        // res.send(data.statuses[0])
        // console.log(data)

        let statuses = data.statuses

        let senCompSum = 0
        let numStatus = statuses.length
        console.log(numStatus)
        statuses.forEach(status => {
            senCompSum += sentiment.analyze(status.text).comparative
        });
        let totalComp = senCompSum / numStatus
        
        res.send({test: totalComp})
    })
})

router.post('/twitterPost', (req, res) => {
    console.log(req.body.url)
    // Test for user post
    let rePost = /https:\/\/twitter\.com\/[a-zA-Z0-9_.-]+\/status\/([0-9]+)/g
    // Test for (only) user 
    let reUser = /https:\/\/twitter\.com\/([a-zA-Z0-9_.-]+)/g

    let retArr = rePost.exec(req.body.url)
    if(retArr === null){
        retArr = reUser.exec(req.body.url)
        console.log(retArr)
        res.redirect(`user/${retArr[1]}`)
    }
    else{
        res.redirect(`tweet/${retArr[1]}`)
    }

    // res.redirect(`${retArr[1]}`)
})

module.exports = router;
