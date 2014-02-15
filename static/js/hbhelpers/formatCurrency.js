define(['Handlebars',
	'common/util/helper'],

function (Handlebars, Helper) {

	Handlebars.registerHelper('formatCurrency', function (num, options) {
		return(Helper.formatNum(num, {currency: '$', decimalDigits: 2}));
	});

});