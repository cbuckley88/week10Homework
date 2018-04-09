var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var inquirer = require('inquirer');
var keys = require('./keys');
var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});

// Function for searching spotify
function searchSpotify(song) {
	spotify.search({type: 'track', query: song.search}, function(err, data) {
			// Log any errors
	    if (err) {
	        console.log('Error occurred: ' + err);
	        return;
	    // get data
	    } else {
	    	// set tracks to the appropriate JSON property
		    var track = data.tracks.items[0];

		    // Log data to the console
		    var logSpotify = 'Artist: ' + track.artists[0].name +
		    	'\nSong name: ' + track.name +
		    	'\nA preview link: ' + track.preview_url +
		    	'\nThe album title: ' + track.album.name;

		    console.log(logSpotify);
		}
	});
}

function searchOMDB(movies) {
	var searchReady = movie.search.replace(/ /g,'+');
	request('http://www.omdbapi.com/?t=' + searchReady + '&y=&plot=full&tomatoes=true&r=json', function(err, response, body) {
		if (err) {
        console.log('Error occurred: ' + err);
        return;
    } else if (!err && response.statusCode === 200) {

	    var logOMDB = 'Title of the movie: ' + JSON.parse(body).Title +
		    '\nYear the movie came out: ' + JSON.parse(body).Year +
		    '\nIMDB Rating of the movie: ' + JSON.parse(body).imdbRating +
		    '\nCountry where the movie was produced: ' + JSON.parse(body).Country +
		    '\nLanguage of the movie: ' + JSON.parse(body).Language +
		    '\nPlot of the movie: ' + JSON.parse(body).Plot +
		    '\nActors in the movie: ' + JSON.parse(body).Actors +
		    '\nRotten Tomatoes Rating: ' + JSON.parse(body).tomatoRating +
		    '\nRotten Tomatoes URL: ' + JSON.parse(body).tomatoURL;

		  
	  }
	});
}

function grabMyTweets() {
	var params = {screen_name: 'a_ashbeck', count: 20};
	client.get('statuses/user_timeline', params, function(err, tweets, response) {
		if (err) {
        console.log('Error occurred: ' + err);
        return;
    } else if (!err) {
	  	tweets.forEach(function(tweet) {
	  		console.log('Tweet: ' + tweet.text + ' --Created at: ' + tweet.created_at);
	  	});
	  }
	});
}

function liriBrains(user) {
	if (user.technology === 'spotify-this-song') {
		searchSpotify(user);
	} else if (user.technology === 'movie-this') {
		searchOMDB(user);
	} else if (user.technology === 'my-tweets') {
		grabMyTweets();
	} else {
		fs.readFile('./random.txt', 'utf8', function(err, data) {
			if (err) {
				console.log(err);
			} else {
			  var output = data.split(',');
			  user.technology = output[0];
			  user.search = output[1];
			  liriBrains(user);
			}
		});
	}
	var logTxt = 'A user entered: ' + user.technology + ' ' + user.search + '\n';
  fs.appendFile('log.txt', logTxt);
}

});
