// the tweets with user-written text, saved so the search box can use them
var writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	// filter to just the written tweets
	writtenTweets = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	}).filter(function(tweet) {
		return tweet.written;
	});
}

function addEventHandlerForSearch() {
	// search the written tweets as text is entered into the search box, and add them to the table
		var searchBox = document.getElementById('textFilter');

		// start with the search box empty
		searchBox.value = "";
		document.getElementById('searchText').innerText = "";
		document.getElementById('searchCount').innerText = 0;

	// 'input' runs every time a letter is typed OR deleted
	searchBox.addEventListener('input', function() {
		var query = searchBox.value;

		// show what's being searched
		document.getElementById('searchText').innerText = query;

		// empty search: clear the table and show 0
		if (query == "") {
			document.getElementById('tweetTable').innerHTML = "";
			document.getElementById('searchCount').innerText = 0;
			return;
		}

		// filter writtenTweets to the ones whose writtenText includes the query
		var matches = writtenTweets.filter(function(tweet) {
			return tweet.writtenText.toLowerCase().includes(query.toLowerCase());
		});

		// put the number of matches in 'searchCount'
		document.getElementById('searchCount').innerText = matches.length;

		// build the table rows
		var rows = "";
		for (var i = 0; i < matches.length; i++) {
			rows += matches[i].getHTMLTableRow(i + 1);
		}
		
		// put the rows in the table body
		document.getElementById('tweetTable').innerHTML = rows;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});