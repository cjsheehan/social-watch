import { SearchResults } from "/collections/Tweets";
const moment = require("moment");
const MAX_SEARCH = 3;

Template.Search.onCreated(function () {
	const instance = Template.instance();
	var self = this;
	Meteor.call("clearSearch");
	instance.newSearch = false;
	instance.wait = false;
	self.autorun(function () {
		self.subscribe("searchResults");
	})
});

Template.Search.helpers({
	searchResults: () => {
		const instance = Template.instance();
		let results = SearchResults.find({}, { sort: { createdAt: -1 } }).fetch();
		if (results.length > 0 && instance.newSearch === true && instance.wait === false) {
			instance.wait = true;
			for (instance.iteration = 0; instance.iteration < MAX_SEARCH - instance.iteration;  instance.iteration++) {
				let maxId = results[Math.floor((results.length - 1) / 2)].idStr;
				let until = "";
				if (instance.iteration === 0) {
					until = moment().format("YYYY-MM-DD");
				}
				
				Meteor.call("searchTwitter", instance.query, until, maxId, true);
			}
			instance.wait = false
			this.newSearch = false;
		}
		return SearchResults.find({}, { sort: { createdAt: -1 } });
	}
});

Template.Search.events({
	"submit form":function(event, template) {
		event.preventDefault();
		let searchQuery = template.find("#twitter-search-input").value;
		if (searchQuery != null && searchQuery != "") {
			const instance = Template.instance();
			instance.newSearch = true;
			instance.query = searchQuery;
			let until = moment().format("YYYY-MM-DD");
			Meteor.call("searchTwitter", searchQuery, until, true);
			return false; // prevent page refresh
		}
	}
});

