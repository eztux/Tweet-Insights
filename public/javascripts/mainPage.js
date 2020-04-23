var placeholders = ['#Africa','@realDonaldTrump','https://twitter.com/cartoonnetwork', 'https://twitter.com/cartoonnetwork/status/1253003334530879489'];

(function cycle() { 
    var placeholder = placeholders.shift();
    $('#formGroupExampleInput').attr('placeholder',placeholder);
    placeholders.push(placeholder);
    setTimeout(cycle,2000);
})();