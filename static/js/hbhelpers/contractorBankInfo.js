define(['Handlebars'],

function (Handlebars) {

    Handlebars.registerHelper('contractorBankInfo', function (contractor, attr) {
		var value = '';
		if (contractor) {
			var contractorPayInfo = null;
			if (contractor.hasOwnProperty('ContractorPayInfo')) {
				contractorPayInfo = contractor.ContractorPayInfo;
			}
			else if (contractor.hasOwnProperty('attributes')) {
				contractorPayInfo = contractor.get('ContractorPayInfo');
			}
			if (contractorPayInfo && contractorPayInfo.hasOwnProperty('DirectDepositInfo')) {
				value = contractorPayInfo.DirectDepositInfo.directDepositAccounts[0][attr];
			}
		}
		return value;
    });
});