import { searchTwitter, clearSearch } from "./twitter/twitter";

Meteor.methods({
	"searchTwitter": function (searchQuery, until, maxId, isNewSearch) {
		if (searchQuery != null && searchQuery != "") {
			searchTwitter(searchQuery, until, maxId,isNewSearch);
		}
	},

	"clearSearch": function () {
		clearSearch();
	}
})