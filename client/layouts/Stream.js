Template.Stream.onCreated(function () {
	Session.set("reactive", true);
});

Template.Stream.events({
	"change #select-attr": function (event, template) {
		var selectValue = template.$("#select-attr").val();
		if (selectValue == "words") {
			Session.set("sortByHashtags", false);
		} else {
			Session.set("sortByHashtags", true);
		}
	},

	"click #btn-pause": function (e) {
		if (Session.get("reactive") === false) {
			Session.set("reactive", true);
			$(e.target).text("Pause");
		} else {
			Session.set("reactive", false);
			$(e.target).text("Stream");
		}
	}
});
