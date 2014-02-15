define(['Handlebars'],

function (Handlebars) {

    Handlebars.registerHelper('getCurrentYear', function (dummy) {
		// For some unknown reason, couldn't get Handlebar Helper to work with 0 parameter so add a dummy parameter.
		return (new Date()).getFullYear();
	});
});