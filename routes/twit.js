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

function uniq(a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}

// router.get('/', (req, res) => {
//     // T.get('statuses/show/:id', { id: '1252462885579694080' }, function(err, data, response) {
//     //     let result = sentiment.analyze(data.text)
//     //     res.send(result)
//     // })

//     res.sendFile('C:/Users/shamu/Desktop/death-project/Tweet-Insights/public/test.html')
// })

router.get('/tweet/:id', (req, res) => {
    T.get('statuses/show/:id', { id: req.params.id }, function(err, data, response) {
        let result = sentiment.analyze(data.text)
        console.log(result)
        // res.send(data)

        res.render('outPage.ejs', {
            sentiment: result
        }) 
    })
})

// router.get('/replies/:id', (req, res) => {
//     T.get('search/tweets', { q: `in_reply_to_status_id:${req.params.id}` }, function(err, data, response) {
//         // let result = sentiment.analyze(data.text)
//         console.log(data)
//         res.send(data)

//     })
// })

router.get('/user/:id', (req, res) => {
    // Make sure we count no retweets
    T.get('search/tweets', { q: `from:${req.params.id}`, count: 100 }, function(err, data, response) {
        let statuses = data.statuses

        let senCompSum = 0
        let posArr = []
        let negArr = []
        let scoreObj = {}
        let numStatus = statuses.length

        statuses.forEach(status => {
            let analysis = sentiment.analyze(status.text)
            analysis.calculation.forEach(wordObj =>{
                scoreObj = {...scoreObj, ...wordObj}
            })
            senCompSum += analysis.comparative
            posArr = posArr.concat(analysis.positive)
            negArr = negArr.concat(analysis.negative)
        });
        let totalComp = senCompSum / numStatus
        
        res.render('outPage.ejs', {
            sentiment: {
                calculations: scoreObj,
                comparative: totalComp,
                positive: uniq(posArr),
                negative: uniq(negArr)
            }
        })
    })
})

router.get('/hash/:id', (req, res) => {
    T.get('search/tweets', { q: `#${req.params.id} -filter:retweets`, count: 100 }, function(err, data, response) {
        let statuses = data.statuses

        let senCompSum = 0
        let posArr = []
        let negArr = []
        let numStatus = statuses.length

        statuses.forEach(status => {
            let analysis = sentiment.analyze(status.text)
            senCompSum += analysis.comparative
            posArr = posArr.concat(analysis.positive)
            negArr = negArr.concat(analysis.negative)
        });
        let totalComp = senCompSum / numStatus
        
        res.render('outPage.ejs', {
            sentiment: {
                comparative: totalComp,
                positive: uniq(posArr),
                negative: uniq(negArr)
            }
        })
    })
})

router.get('/handle/:id', (req, res) => {
    T.get('search/tweets', { q: `#${req.params.id} -filter:retweets`, count: 100 }, function(err, data, response) {
        console.log(data)
        let statuses = data.statuses

        let senCompSum = 0
        let posArr = []
        let negArr = []
        let numStatus = statuses.length

        statuses.forEach(status => {
            let analysis = sentiment.analyze(status.text)
            senCompSum += analysis.comparative
            posArr = posArr.concat(analysis.positive)
            negArr = negArr.concat(analysis.negative)
        });
        let totalComp = senCompSum / numStatus
        
        res.render('outPage.ejs', {
            sentiment: {
                comparative: totalComp,
                positive: uniq(posArr),
                negative: uniq(negArr)
            }
        })
    })
})

router.post('/twitterPost', (req, res) => {
    console.log(req.body.url)
    // Test for user post
    let rePost = /https:\/\/twitter\.com\/[a-zA-Z0-9_.-]+\/status\/([0-9]+)/g
    // Test for (only) user 
    let reUser = /https:\/\/twitter\.com\/([a-zA-Z0-9_.-]+)/g
    // User inputs a hashtag
    let reHash = /^#([a-zA-Z0-9_.-]+)$/g
    // User looks for tweets using @user_name
    let reHandle = /^@([a-zA-Z0-9_.-]+)$/g

    let retArr = rePost.exec(req.body.url)
    if(retArr != null){
        res.redirect(`tweet/${retArr[1]}`)
        return
    }

    retArr = reUser.exec(req.body.url)
    if(retArr != null){
        res.redirect(`user/${retArr[1]}`)
        return
    }

    retArr = reHash.exec(req.body.url)
    if(retArr != null){
        res.redirect(`hash/${retArr[1]}`)
        return
    }

    retArr = reHandle.exec(req.body.url)
    if(retArr != null){
        res.redirect(`handle/${retArr[1]}`)
        return
    }
})

module.exports = router;
