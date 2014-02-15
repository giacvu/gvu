define(['Handlebars'],

function (Handlebars) {

    Handlebars.registerHelper('formatDate', function (dateTime) {
		if (dateTime) {
			return dateTime.substring(0, 10);
		}
    });
});