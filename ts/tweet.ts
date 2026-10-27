class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        // completed tweets start with "Just completed" or "Just posted"
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        }

        // live events start with "Watch my"
        if (this.text.startsWith("Watch my")) {
            return "live_event";
        }

        // achievements start with "Achieved" or "I just set a goal"
        if (this.text.startsWith("Achieved") || this.text.startsWith("I just set a goal")) {
            return "achievement";
        }

        // everything else
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        // user text comes after " - ", but TomTom watch text is added automatically, so it doesn't count
        return this.text.includes(" - ") && !this.text.includes("TomTom MySports Watch");
    }
        
    get writtenText():string {
        if(!this.written) {
            return "";
        }
        // find where the user's text starts (right after " - ")
        var start = this.text.indexOf(" - ") + 3;

        // find where the user's text ends (right before the first URL)
        var end = this.text.indexOf("https://");

        // cut out the text between the start and end, and return it
        return this.text.substring(start, end).trim();
    }

    // returns "positive", "negative", or "neutral" based on the sentiment of the written text
    get sentiment():string {
        // only look at what the person wrote, in lowercase so "Great" matches "great"
        var text = this.writtenText.toLowerCase();

        var positiveWords = ["great", "good", "awesome", "perfect", "enjoy", "proud", "happy", "nice", "best", "fantastic", "amazing", "love", "pb", "beautiful", "lovely", "gorgeous", "glad", "super", "!"];
        var negativeWords = ["bad", "terrible", "tired", "awful", "horrible", "hate", "disappointed", "sad", "worst", "injury", "tough", "brutal", "pain", "hurt", "sore", "slow", "struggle", "exhausted", "sick", "humid", "heavy", "rough"]; 

        // count how many positive words show up
        var positiveCount = 0;
        for (var i = 0; i < positiveWords.length; i++) {
            if (text.includes(positiveWords[i])) {
                positiveCount++;
            }
        }

        // count how many negative words show up
        var negativeCount = 0;
        for (var i = 0; i < negativeWords.length; i++) {
            if (text.includes(negativeWords[i])) {
                negativeCount++;
            }
        }

        // return the sentiment based on which count is higher
        if (positiveCount > negativeCount) {
            return "positive";
        } else if (negativeCount > positiveCount) {
            return "negative";
        } else {
            return "neutral";
        }
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        // parse the activity type from the text of the tweet
        var words = this.text.split(" ");
        var unit = words[4];

        // if words[4] is a unit, the activity starts after it; otherwise, the activity starts at words[3]
        var start = 3;
        if (unit == "km" || unit == "mi") {
            start = 5;
        }

        // collect words until we reach "with", "-", "in", a link, or an extra space
        var activityWords = [];
        for (var i = start; i < words.length; i++) {
            if (words[i] == "with" || words[i] == "-" || words[i] == "in" || words[i].startsWith("https://") || words[i] == "") {
                break;
            }
            activityWords.push(words[i]);
        }
        
        // join the activity words back together with spaces, and return it
        return activityWords.join(" ");
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        // parse the distance from the text of the tweet
        var words = this.text.split(" ");
        var unit = words[4];

        // miles: turn the text into a number
        if (unit == "mi") {
            return parseFloat(words[3]);
        }

        // kilometers: turn it into a number, and convert it to miles
        if (unit == "km") {
            return parseFloat(words[3]) * 0.621371;
        }

        // no distance found (like spinning or yoga), return 0 
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        // split the tweet into words, and turn every link into a clickable one
        var words = this.text.split(" ");
        for (var i = 0; i < words.length; i++) {
            if (words[i].startsWith("https://")) {
                words[i] = '<a href="' + words[i] + '" target="_blank">' + words[i] + '</a>';
            }
        }
        // glue the words back together with spaces
        var tweetWithLink = words.join(" ");

        // return one table row with 3 cells
        return "<tr><td>" + rowNumber + "</td><td>" + this.activityType + "</td><td>" + tweetWithLink + "</td><td>" + this.sentiment + "</td></tr>" ;
    }
}