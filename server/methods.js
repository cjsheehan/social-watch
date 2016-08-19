import { searchTwitter } from "./twitter/twitter";

Meteor.methods({
	"searchTwitter": function (searchQuery) {
		if (searchQuery != null && searchQuery != "") {
			searchTwitter(searchQuery);
		}
	}
})