import moment from "moment"; 

Template.Tweet.helpers({
	dateTime: (createdAt) => {
		// e.g. "Fri Jul 29 18:22:32 +0000 2016"
		return moment(createdAt, "dd MMM DD HH:mm:ss ZZ YYYY", "en").format("MMM DD, HH:mm");
	},

	formatLocation: (location, places) => {
		return location.map((coord) => { 
			return coord.toFixed(places) + " "; 
		});
	}
});