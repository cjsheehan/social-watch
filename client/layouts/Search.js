import { SearchResults } from "/collections/Tweets";
const moment = require("moment");


Template.Search.onCreated(function () {
	var self = this;
	self.autorun(function () {
		self.subscribe("searchResults");
	})
});

Template.Search.helpers({
	searchResults: () => {
		return SearchResults.find({});
	}
});

Template.Search.events({
	"submit form":function(event, template) {
		event.preventDefault();
		let searchQuery = template.find("#twitter-search-input").value;
		if (searchQuery != null && searchQuery != "") {
			Session.set("newSearch", true);
			let until = moment().format("YYYY-MM-DD");
			Meteor.call("searchTwitter", searchQuery, until, true);
			return false; // prevent page refresh
		}
	}
});

