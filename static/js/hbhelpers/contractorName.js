define(['Handlebars'],

function (Handlebars) {

    Handlebars.registerHelper('contractorName', function (contractor) {
		var name = '';
		if (contractor) {
			if (contractor.hasOwnProperty('Type')) {
				if (contractor.Type == 'Business') {
					name = contractor.BusinessName;
				}
				else if (contractor.Type == 'Individual') {
					name = contractor.GivenName + ' ' + contractor.FamilyName;
				}
			}
			else {
				if (contractor.hasOwnProperty('attributes')) {
					var contractorType = contractor.get('Type');
					if (contractorType) {
						if (contractorType == 'Business') {
							name = contractor.get('BusinessName');
						}
						else if (contractorType == 'Individual') {
							name = contractor.get('GivenName') + ' ' + contractor.get('FamilyName');
						}
					}
				}
			}
		}
		return name;
    });
});