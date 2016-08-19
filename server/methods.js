import { searchTwitter } from "./twitter/twitter";

Meteor.methods({
	"searchTwitter": function (searchQuery, until, isNewSearch) {
		if (searchQuery != null && searchQuery != "") {
			searchTwitter(searchQuery, until, isNewSearch);
		}
	}
})