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
        // user texts comes after " - ", but TomTom watch text is added automatically, so it doesn't count
        return (this.text.includes(" - ")) && !this.text.includes("TomTom MySports Watch");
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

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
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
        return "<tr><td>" + rowNumber + "</td><td>" + this.activityType + "</td><td>" + tweetWithLink + "</td></tr>";
    }
}