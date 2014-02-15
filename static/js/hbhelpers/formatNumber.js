define(['Handlebars',
	'common/util/helper'],

function (Handlebars, Helper) {

    Handlebars.registerHelper('formatNumber', function (num, options) {
		return(Helper.formatNum(num, {currency: '', decimalDigits: 0}));
    });
});