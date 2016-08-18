Template.Search.events({
	"submit form":function(event, template) {
		event.preventDefault();
		let searchQuery = template.find("#twitter-search-input").value;
		if (searchQuery != null && searchQuery != "") {
			Session.set("twitterSearch", searchQuery.value);
			console.log("search", searchQuery);
			let searchResult = Meteor.call("searchTwitter", searchQuery, function (err, res) {
				if (res) {
					console.log("res", JSON.stringify(res));
				}
			});
			return false; // prevent page refresh
		}

	}
});

