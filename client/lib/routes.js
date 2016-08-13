import "/client/layouts/HomeLayout.html";

FlowRouter.route("/", {
	name: "home",
	action() {
		BlazeLayout.render("HomeLayout");
	}
});