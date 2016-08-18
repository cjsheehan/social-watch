import "/client/layouts/Stream.html";
import "/client/layouts/Search.html";

FlowRouter.route("/", {
	name: "stream",
	action() {
		BlazeLayout.render("Stream");
	}
});

FlowRouter.route("/search", {
	name: "search",
	action() {
		BlazeLayout.render("Search");
	}
})