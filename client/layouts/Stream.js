Template.Stream.events({
	"change #select-attr": function (event, template) {
		var selectValue = template.$("#select-attr").val();
		if (selectValue == "words") {
			Session.set("sortByHashtags", false);
		} else {
			Session.set("sortByHashtags", true);
		}
		console.log(selectValue);
	}
});