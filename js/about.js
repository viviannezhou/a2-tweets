function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	


	// count how many tweets are completed events
	var completedEvents = tweet_array.filter(function(tweet) {
		return tweet.source == "completed_event";
	}).length;

	// count how many tweets are live events
	var liveEvents = tweet_array.filter(function(tweet) {
		return tweet.source == "live_event";
	}).length;

	// count how many tweets are achievements
	var achievements = tweet_array.filter(function(tweet) {
		return tweet.source == "achievement";
	}).length;

	// count how many tweets are miscellaneous
	var miscellaneous = tweet_array.filter(function(tweet) {
		return tweet.source == "miscellaneous";
	}).length;

	// put completed count in every span with the class "completedEvents"
	var completedElements = document.getElementsByClassName('completedEvents');
	for (var i = 0; i < completedElements.length; i++) {
		completedElements[i].innerText = completedEvents;
	}

	// put live count in every span with the class "liveEvents"
	var liveElements = document.getElementsByClassName('liveEvents');
	for (var i = 0; i < liveElements.length; i++) {
		liveElements[i].innerText = liveEvents;
	}

	// put achievement count in every span with the class "achievements"
	var achievementElements = document.getElementsByClassName('achievements');
	for (var i = 0; i < achievementElements.length; i++) {
		achievementElements[i].innerText = achievements;
	}

	// put miscellaneous count in every span with the class "miscellaneous"
	var miscellaneousElements = document.getElementsByClassName('miscellaneous');
	for (var i = 0; i < miscellaneousElements.length; i++) {
		miscellaneousElements[i].innerText = miscellaneous;
	}


	// completed events as a percent of all tweets, with 2 decimals
	var completedPct = math.format(completedEvents / tweet_array.length * 100, {notation: 'fixed', precision: 2}) + '%';
	var completedPctElements = document.getElementsByClassName('completedEventsPct');

	for (var i = 0; i < completedPctElements.length; i++) {
		completedPctElements[i].innerText = completedPct;
	}

	// live events as a percent of all tweets, with 2 decimals
	var livePct = math.format(liveEvents / tweet_array.length * 100, {notation: 'fixed', precision: 2}) + '%';
	var livePctElements = document.getElementsByClassName('liveEventsPct');

	for (var i = 0; i < livePctElements.length; i++) {
		livePctElements[i].innerText = livePct;
	}

	// achievements as a percent of all tweets, with 2 decimals
	var achievementPct = math.format(achievements / tweet_array.length * 100, {notation: 'fixed', precision: 2}) + '%';
	var achievementPctElements = document.getElementsByClassName('achievementsPct');

	for (var i = 0; i < achievementPctElements.length; i++) {
		achievementPctElements[i].innerText = achievementPct;
	}

	// miscellaneous as a percent of all tweets, with 2 decimals
	var miscellaneousPct = math.format(miscellaneous / tweet_array.length * 100, {notation: 'fixed', precision: 2}) + '%';
	var miscellaneousPctElements = document.getElementsByClassName('miscellaneousPct');

	for (var i = 0; i < miscellaneousPctElements.length; i++) {
		miscellaneousPctElements[i].innerText = miscellaneousPct;
	}

	// sort a copy of the tweets from oldest to newest
	var sortedTweets = tweet_array.slice().sort(function(a, b) {
		return a.time - b.time;
	});
	var earliestTweet = sortedTweets[0].time;
	var latestTweet = sortedTweets[sortedTweets.length - 1].time;

	// format like "Sunday, September 23, 2018" and put them on the page
	var dateFormat = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

	document.getElementById('firstDate').innerText = earliestTweet.toLocaleDateString(undefined, dateFormat);
	document.getElementById('lastDate').innerText = latestTweet.toLocaleDateString('en-US', dateFormat);

	// completed tweets that include user-written text
	var written = tweet_array.filter(function(tweet) {
		return tweet.source == "completed_event" && tweet.written;
	}).length;


	// put written count in every span with the class "written"
	var writtenElements = document.getElementsByClassName('written');
	for (var i = 0; i < writtenElements.length; i++) {
		writtenElements[i].innerText = written;
	}

	// written tweets as a percent of completed tweets (not all tweets), with 2 decimals
	var writtenPct = math.format(written / completedEvents * 100, {notation: 'fixed', precision: 2}) + '%';
	var writtenPctElements = document.getElementsByClassName('writtenPct');
	
	for (var i = 0; i < writtenPctElements.length; i++) {
		writtenPctElements[i].innerText = writtenPct;
	}
}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});