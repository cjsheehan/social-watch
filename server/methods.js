Meteor.methods({
	"searchTwitter": function (searchQuery) {
		return "called " + searchQuery + " on server";
	}
})