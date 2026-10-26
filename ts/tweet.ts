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
        // find the link: it starts at "https://" and ends at the next space
        var linkStart = this.text.indexOf("https://");
        var linkEnd = this.text.indexOf(" ", linkStart);
        if (linkEnd == -1) {
            linkEnd = this.text.length; // link is at the very end of the tweet
        }
        var link = this.text.substring(linkStart, linkEnd);

        // swap the plain link for a clickable one that opens in a new tab
        var clickableLink = "<a href='" + link + "' target='_blank'>" + link + "</a>";
        var tweetWithLink = this.text.replace(link, clickableLink);

        //TODO: return one table row with 3 cells
        return "<tr><td>" + rowNumber + "</td><td>" + this.activityType + "</td><td>" + tweetWithLink + "</td></tr>";
    }
}