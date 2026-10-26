function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// only completed tweets have an activity type, so filter to just those
	var completedTweets = tweet_array.filter(function(tweet) {
		return tweet.source == "completed_event";
	});

	// count each activity
	var counts = {};
	completedTweets.forEach(function(tweet) {
		var type = tweet.activityType;
		if (counts[type] === undefined) {
			counts[type] = 0;
		}
		counts[type] = counts[type] + 1;
	});

	// turn into list of objects for Vega-Lite, sorted biggest to smallest
	var activityCounts = Object.keys(counts).map(function(type) {
		return {activity: type, count: counts[type]};
	}).sort(function(a, b) {
		return b.count - a.count;
	});

	// the number of activity types, and the three most-tweeted activities
	var numberOfActivities = activityCounts.length;
	var firstMost = activityCounts[0].activity;
	var secondMost = activityCounts[1].activity;
	var thirdMost = activityCounts[2].activity;

	// fill in the spans at the top of the page
	document.getElementById('numberActivities').innerText = numberOfActivities;
	document.getElementById('firstMost').innerText = firstMost;
	document.getElementById('secondMost').innerText = secondMost;
	document.getElementById('thirdMost').innerText = thirdMost;

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityCounts
	  },
	  // bar chart: one bar for each activity, with the height of the bar representing the number of tweets. tallest first.
	  mark: "bar",
	  encoding: {
	    x: {field: "activity", type: "nominal", "sort": "-y", "title": "Activity Type"},
	    y: {field: "count", type: "quantitative", "title": "Number of Tweets"},
	    tooltip: [
	      {field: "activity", type: "nominal", title: "Activity Type"},
	      {field: "count", type: "quantitative", title: "Number of Tweets"}
	    ]
	  },
	  title: {
	    text: "Number of Tweets Containing Each Type of Activity",
	    fontSize: 20,
	    anchor: "start",
	    color: "#000000"		
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	// the 3 most common activities
	var top3 = [firstMost, secondMost, thirdMost];

	// one row per activity: its type, distance, and day of the week
	var distanceData = completedTweets.filter(function(tweet) {
		return top3.includes(tweet.activityType);
	}).map(function(tweet) {
		return {
			activity: tweet.activityType,
			distance: tweet.distance,
			day: tweet.time.toLocaleDateString('en-US', {weekday: 'short'})
		};
	});

	var distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Distance of each activity by day of the week.",
	  "data": {"values": distanceData},
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "day", "type": "ordinal", "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], "title": "Day of the week"},
	    "y": {"field": "distance", "type": "quantitative", "title": "Distance (miles)"},
	    "color": {"field": "activity", "type": "nominal", "title": "Activity type"}
	  }
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions: false});

	// chart 3: the means
	var distance_agg_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Mean distance of each activity by day of the week.",
	  "data": {"values": distanceData},
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "day", "type": "ordinal", "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], "title": "Day of the week"},
	    "y": {"field": "distance", "type": "quantitative", "title": "Mean distance (miles)", "aggregate": "mean"},
	    "color": {"field": "activity", "type": "nominal", "title": "Activity type"}
	  }
	};
	vegaEmbed('#distanceVisAggregated', distance_agg_spec, {actions: false});

	// start by showing all the dots, and hide the means chart
	var allChart = document.getElementById('distanceVis');
	var meanChart = document.getElementById('distanceVisAggregated');
	var button = document.getElementById('aggregate');
	meanChart.style.display = 'none';

	// each click swaps which chart is showing, and updates the button text
	button.addEventListener('click', function() {
		if (meanChart.style.display == 'none') {
			meanChart.style.display = 'block';
			allChart.style.display = 'none';
			button.innerText = 'Show all activities';
		} else {
			meanChart.style.display = 'none';
			allChart.style.display = 'block';
			button.innerText = 'Show means';
		}
	});

	// read from the means chart: bike longest, walk shortest, weekends longer (hard-coding allowed here)
	var longestActivityType = "bike";
	var shortestActivityType = "walk";
	var weekdayOrWeekendLonger = "weekends";
	
	document.getElementById('longestActivityType').innerText = longestActivityType;
	document.getElementById('shortestActivityType').innerText = shortestActivityType;
	document.getElementById('weekdayOrWeekendLonger').innerText = weekdayOrWeekendLonger;
}

// wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});