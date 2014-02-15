//
// IMPORTANT: Copious logging is sent to Javascript debug console. So use the browser's console window to monitor activity and debug problems.
//
// IMPORTANT: Several OII Javascript files get loaded, and we have to wait for all of them to load before proceeding with the OII
//            widget workflow. So we use window.setTimeout() to repeatedly wait for the scripts to load. Each "wait" is 100ms and
//            by default we wait up to 100 times. If the scripts aren't loaded by then, we stop trying and log an error. You can
//            modify the number of times we wait by setting oiiWidgets.loadDelayCount before calling oiiWidgets.launch().
//
// Usage:
// 	1. Add a <div> element to your page to serve as a container for the OII widgets' content
//	2. Include this script (NOTE: You need to be using https in order for the OII widgets and IAM cookies to all work together happily)
// 	3. Call oiiWidgets.launch(<params>), where <params> defines the following values:
//
//		offeringId:					App's IAM offering ID [*** required ***]
// 		oiiEnv: 					OII environment to be used (e.g., "e2e", "prod")
//		oiiUrl:						Base URL for OII environment to use [*** required ***]
//		containerId:				"id" value of <div> used to host OII widgets on your page [*** required ***]
//		isEmailConfirmed:			Indicates whether email is considered confirmed by app
//		unencryptedEmail:			User's email (should match email in encryptedEmail parameter)
//		encryptedEmail:				User's email, encrypted so that it can be used to find accounts by email
//		userId:						User ID value to pre-fill for User ID fields.
//		encryptedData:				If provided, used by Realm Picker (format: realmId=12345!offeringRoleIds=Intuit.ems.CompanyAdmin,Intuit.ems.Employees)
//		companyName:				Company name for current user. If provided, will be used to auto-create realm. If omitted and realm needs to be created, user will be prompted for company name.
//		startWidget:				Optional specification of which widget to start with, overriding the normal starting widget (use one of the oiiWidgets.WIDGET... constants to specify the widget ID)
//		flow:						Optional flow selector to control back-end business logic (default value set based on isSignin, isSignup, isMigration, or isUpdate)
//		isSignin:					true if using widgets for sign-in workflow [*** default=false ***] (defaults "flow" param to "sign-in")
//		isSignup:					true if using widgets for sign-up workflow [*** default=false ***] (defaults "flow" param to "sign-up") (see account-picker note below)
//		isMigration:				true if using widgets for migration workflow [*** default=false ***] (defaults "flow" param to "migration")
//		isUpdate:					true if using widgets for update workflow [*** default=false ***] (defaults "flow" param to "migration")
//		autoSignup:					true to allow Account Picker to automatically go to Sign Up if no account found for given/entered email address [***default=false***] (see account-picker note below)
//		allowAccountCreate:			false to hide "create new account" link on Sign In widget [***default=true***]
// 		allowRealmCreate:			false to hide "create new company" link on Realm Picker widget [***default=true***]
//		useCurrentLogin:			true to use current login in widget workflow, set to false to clear current login when launching OII workflow [*** default=true ***]
//		showVerifyLogin:			true to show verify login UI if user is already logged in [*** default=false ***]
//		showSecurityUpgrade:		true to show "Upgrade Security Level" prompt for low security accounts [*** default=false ***]
//		passwordRecoveryFinishUrl: 	URL to navigate to when user completes password recovery login (from password recovery email)
//		passwordRecoveryContinue:	function pointer called when users clicks "Continue" at end of password recovery widget (setting this causes Continue button to be shown)
//		onTermsOfServiceClick:		function pointer called when "terms of service" link clicked (if not set, terms-of-service link will not be shown)
//		onCustomerServiceClick: 	function pointer called when "customer service" link clicked (if not set, customer-service link will not be shown)
//		onCreateAccountClick:		function pointer called when "create a new account" link clicked (if not set, create account is handled by widgets)
//		onNotify:					function pointer called for notifications of interesting activity (see sample code below for parameters received)
//		onUpdate:					function pointer called when widget content is updated (see sample code below for parameters received)
//		onFinish:					function pointer called when realm selection is completed (see sample code below for parameters received)
//		onFinishNeedCreate:			function pointer called when a realm needs to be created [*** default=null ***] (if not set, create company is handled by OII)
//		onError:					function pointer called when widget content encounters an error (see sample code below for parameters received)
//	The values below are available for changing text within the widgets
//		emailCheckerHeader:					account-picker widget's "enter email" view header
//		emailCheckerSubHeader:				account-picker widget's "enter email" view sub-header
//		selectAccountHeader:				account-picker widget's account list header
//		selectAccountSubHeader:				account-picker widget's account list sub-header
//		selectRealmHeader:					realm-picker widget's company list header
//		selectRealmSubHeader:				realm-picker widget's company list sub-header
//		createRealmHeader:					realm-picker widget's "create new realm" view header
//		createRealmSubHeader:				realm-picker widget's "create new realm" view sub-header
//		signInHeader:						sign-in widget's standard header
//		signInSubHeader:					sign-in widget's standard sub-header
//		signInSubHeaderUsernameRecovery:	alternate sign-in sub-header if coming from username-recovery widget
//		signInSubHeaderPasswordRecovery:	alternate sign-in sub-header if coming from password-recovery widget
//		signInHeaderAccountAutoSelected:	alternate sign-in header when invoked from account-picker with account auto selected (see "sign-in header" note below)
//		signInHeaderAccountUserSelected:	alternate sign-in header when invoked from account-picker with account selected by user from account list (see "sign-in header" note below)
//		signInHeaderAccountNotShown:		alternate sign-in header when invoked from account-picker with account auto selected, but user ID not displayable (see "sign-in header" note below)
//		signInUserIdLabel:					sign-in widget's label for User ID field
//		signInPasswordLabel:				sign-in widget's label for Password label
//		signUpHeader:						sign-up widget's standard header
//		signUpSubHeader:					sign-up widget's standard sub-header
//		securityLevelManagerHeader:			security-level-manager widget's header
//		securityLevelManagerSubHeader:		security-level-manager widget's sub-header
//
//	Example Usage:
//		<div id="oiiContainer"></div>
//		<script type-"text/javascript" src="https://yourdomain.com/oiiWidgets.js"></script>
//		<script type="text/javascript">
//			oiiWidgets.launch({
//				offeringId : "Intuit.ems.iop",					/* probably ok to hard-code for your app */
//				oiiEnv : "e2e",									/* should vary based on current environment */
//				oiiUrl : "https://accounts-e2e.intuit.com",		/* should vary based on current environment */
//				containerId : "oiiContainer",					/* must match <div> element above */
//				isEmailConfirmed : true,
//				unencryptedEmail : "test@test.com",
//				encryptedEmail : "asd2654foi1wer98e3!==",
//				companyName : "Acme Inc.",
//				startWidget : oiiWidgets.WIDGET_SIGN_IN,		/* If, for example, you wanted to force starting with the sign-in -widget */
//				isSignin : true,								/* set to true if doing sign-in workflow */
//				useCurrentLogin : false,
//				showVerifyLogin : false,
//				showSecurityUpgrade : true,
//				onTermsOfServiceClick : handleTermsOfServiceClick,
//				onCustomerServiceClick : handleCustomerServiceClick,
//				onNotify : handleWidgetNotify,
//				onUpdate : handleWidgetUpdate,
//				onFinish : handleWidgetFinish,
//				onFinishNeedCreate : handleWidgetNeedCreate,
//				onError : handleWidgetError,
//				signInHeaderAccountAutoSelected : "We noticed that <b>{1}</b> already has an Intuit account.",
//				signInHeaderAccountUserSelected : "Now that you've selected your user ID, please use it to sign in to your Intuit account.",
//				signInHeaderAccountNotShown : "We noticed that <b>{0}</b> already has an Intuit account. Enter the user ID associated with that email address."
//			});
//
//			function handleWidgetNotify(widgetId, info) {
//				--- log and/or track activity --
//				--- info parameter is an object whose properties vary based on the notification - see "info object" documentation below ---
//			}
//
//			function handleWidgetUpdate(widgetId, info) {
//				--- resize frame or perform any other updates needed when a widget's content gets udpated (good place to log widget activity) ---
//				--- info parameter is an object whose properties vary based on the notification - see "info object" documentation below ---
//			}
//
//			function handleWidgetFinish(realmId, grantInfo, autoCreated) {
//				--- perform whatever actions you need when OII workflow has completed ---
//				--- realmId indicates the selected realm ---
//				---    NOTE: Workflow can exit via this callback with no realmId. This indicates that user was prompted to enter ---
//				---          an email address, and no account was found for the entered email address.                           ---
//				--- grantInfo indicates if QBO realm was selected - if so value will be QBO offering ID, if not value will be null ---
//				--- autoCreated is true or false to indicate if realm was created by OII ---
//			}
//
//			function handleWidgetNeedCreate(companyName) {
//				--- handle realm creation workflow ---
// 				--- company name will be null if no company was provided to the widgets ---
//			}
//
//			function handleWidgetError(widgetId, errorCode, logMessage) {
//				--- show appropriate user message for widgetId and errorCode, write logMessage to server log ---
//				--- see oiiWidgets.errorCodes.* for the possible errorCode values ---
//			}
//
//			function handleTermsOfServiceClick() {
//				window.open("http://business.intuit.com/directory/terms.jsp", "oiiNavigation");
//			}
//
//			function handleCustomerServiceClick() {
//				window.open("http://about.intuit.com/contact/", "oiiNavigation");
//			}
//		</script>
//
// NOTE: The account-picker widget is the first widget selected if isSignup parameter is set to true.
//
// 		If email parameters (unencryptedEmail and encryptedEmail) are not passed to oiiWidgets.launch(), the account-picker will prompt for an email address.
//		When an email address is entered, the account-picker will look up the email address, treating it as "unconfirmed".
//
// 		If email parameters (unencryptedEmail and encryptedEmail) are passed to oiiWidgets.launch(), the account-picker will not prompt for an email address.
//		Instead, it will immediately look up the email address, treating it as a "confirmed" email address.
//
//		Business rules in the OII back-end (defined for the offering ID) will determine how a match for the email address is determined. For IOP, for example,
//      an "unconfirmed" email address will match only a single QBO account. If there are multiple QBO accounts or no QBO accounts for the email, then it will
//      be treated as not found. A "confirmed" email address, however, will match any account.
//
// 		By default, if an account match is not found for the email, the onFinish handler will be called with no realmID. It's then the caller's responsibility
// 		to continue the workflow. You can change this behavior by passing autoSignup as true. In this case, when an email match is not found, the sign-up
// 		widget will automatically be displayed.
//
// NOTE: sign-in header text has 3 possible alternate values that are shown for different cases where user is coming directly form account-picker.
//			signInHeaderAccountAutoSelected	- account was auto selected by account-picker based on matching email address to account
//			signInHeaderAccountUserSelected	- account-picker showed account list and user selected an account
//			signInHeaderAccountNotShown		- account was auto selected by account-picker based on matching email address to account, but
//											  the account's email address doesn't match the user ID and the email is not a "confirmed" email,
//											  so it's not safe to show the user ID to the user as a pre-fill value for the sign-in widget
//		 When the condition exists for one of these alternate headers to be shown, the standard header and sub-header are hidden.
// 		 If the alternate header text contains the string {0}, it will be replaced with the email address used to select the account.
// 		 If the alternate header text contains the string {1}, it will be replaced with the user ID of the selected account.
//		 If the alternate header contains {0} but an email address is not available, that particular alternate header will not be used.
//		 By definition, the "signInHeaderAccountNotShown" alternate header cannot contain the {1} parameter.
//		 The alternate text is contained in an <h2> element with an id and class of "alternateSignInHeader", so it can be targeted with CSS
//		 using h2.alternateSignInHeader or h2#alternateSignInHeader.
//		 The alternate text is set via innerHTML, so it can contain HTML elements, for example <b> for bold text.
//
// NOTE: An info object is passed to the onNotify and onUpdate handlers (if these are specified).
//       There is no fixed structure to this object - it contains properties for whatever is relevant for the particular case.
//       So it's best used in one of the following manners:
//
//          1. Check for a specific property to detect that a certain action or condition has occurred.
//				For example, to check if a signUp button was clicked:
//
//					// Check if "trigger" property indicates that a "click" event occurred
//					if( info["trigger"] && info["trigger"] === "click" ) {
//						// Check if the link clicked was "signUp"
//						if( info["link"] && info["link"] === "signUp" ) {
//							... do something to handle click ...
//						}
//					}
//
//          2. Iterate over the existing properties to log or track their values.
//				For example, to log all of the properties in name=value format:
//
//					// Iterate over the "info" objects properties.
//					for(prop in info) {
//						// Get the value of current property.
//						var value = info[prop];
//						// Log property as name=value
//						console.log( prop + "=" + value );
//					}
//

(function(window, document, undefined) {
	// Private global variables.
	var WIDGET_PARAMS = {};
	var WIDGET_FUNCTIONS = {};
	var DIV_DEFS = null;
	var SCRIPTS_TO_LOAD = new Array();
	var LOAD_DELAY_COUNT = 0;
	var ELEMENT_DIV_ID = 0;
	var ELEMENT_FUNCTION = 1;
	var ELEMENT_SCRIPT_ID = 2;
	var ELEMENT_SCRIPT_OBJECT = 3;
	var PATH_SCRIPTS = "/IUS-Plugins/scripts/ius.js";
	var PATH_LOADER_ANIMATION = "/images/ajax-loader.gif";
	var GLOGIN_COOKIE_NAME = null;
	var GLOGIN_COOKIE_VALUE = null;
	var COOKIE_EXPIRATION = 365;
	var SCRIPT_LOAD_START_TIME = null;
	var SCRIPT_LOAD_TOTAL_TIME = null;
	var LOGIN_CHECK_START_TIME = null;
	var ACCOUNT_PICKER_START_TIME = null;
	var REALM_PICKER_START_TIME = null;

	// Create our object if it doesn't yet exist.
	if (typeof oiiWidgets === 'undefined' ) {
		oiiWidgets = {};
		oiiWidgets.cookies = {};
	}

	// Initialize values.
	oiiWidgets.loadDelayCount = 100;
	oiiWidgets.enableVerifyLogin = true;
	oiiWidgets.userEnteredEmail = null;
	oiiWidgets.userNamePrefill = null;
	oiiWidgets.passwordPrefill = null;
	oiiWidgets.isAccountFound = null;
	oiiWidgets.accountListCount = null;
	oiiWidgets.realmListCount = null;
	oiiWidgets.currentWidgetId = null;
	oiiWidgets.previousWidgetId = null;

	// Define widget IDs used for the OII workflow.
	oiiWidgets.WIDGET_SIGN_IN = "ius-sign-in-widget" ;
	oiiWidgets.WIDGET_SIGN_IN_VERIFY = "ius-sign-in-verify-widget";	// This isn't a real OII widget - it's the "verify login" version of the sign-in widget
	oiiWidgets.WIDGET_SIGN_UP = "ius-sign-up-widget";
	oiiWidgets.WIDGET_REALM_PICKER = "ius-realm-picker-widget";
	oiiWidgets.WIDGET_REALM_PICKER_CREATE = "ius-realm-picker-create-widget"; // This isn't a real OII widget - it's the "create company" version of the realm-picker widget
	oiiWidgets.WIDGET_REALM_PICKER_SIGNOUT = "ius-realm-picker-signout-widget"; // // This isn't a real OII widget - it's the "verify sign out" version of the realm-picker widget
	oiiWidgets.WIDGET_ACCOUNT_PICKER = "ius-account-picker-widget";
	oiiWidgets.WIDGET_ACCOUNT_PICKER_EMAIL = "ius-account-picker-email-widget";	// This isn't a real OII widget - it's the Account Picker widget "enter email" view.
	oiiWidgets.WIDGET_USERNAME_RECOVERY = "ius-username-recovery-widget";
	oiiWidgets.WIDGET_USERNAME_RECOVERY_SUCCESS = "ius-username-recovery-success-widget";	// This isn't a real OII widget - it's the final "success" step of the username recovery widget.
	oiiWidgets.WIDGET_PASSWORD_RECOVERY = "ius-password-recovery-widget";
	oiiWidgets.WIDGET_PASSWORD_RECOVERY_SUCCESS = "ius-password-recovery-success-widget";	// This isn't a real OII widget - it's the final "success" step of the password recovery widget.
	oiiWidgets.WIDGET_SECURITY_LEVEL = "ius-security-level-manager-widget";
	// For each widget, define the following:
	//	- ID for <div> element that will be created for the widget
	//	- Javascript function pointer to call for displaying the widget
	//	- ID (defined by OII) to include in oii <script> tag's "data-widgets" attribute
	//	- Javascript Object created for the widget
	DIV_DEFS = [
		[oiiWidgets.WIDGET_SIGN_IN, 			showSignIn,					"sign-in",					"intuit.ius.signIn"],
		[oiiWidgets.WIDGET_SIGN_UP, 			showSignUp,					"sign-up",					"intuit.ius.signUp"],
		[oiiWidgets.WIDGET_SECURITY_LEVEL, 		showSecurityLevelManager,	"security-level-manager",	"intuit.ius.securityLevelManager"],
		[oiiWidgets.WIDGET_REALM_PICKER, 		showRealmPicker,			"realm-picker",				"intuit.ius.realmPicker"],
		[oiiWidgets.WIDGET_ACCOUNT_PICKER, 		showAccountPicker,			"account-picker",			"intuit.ius.accountPicker"],
		[oiiWidgets.WIDGET_USERNAME_RECOVERY, 	showUsernameRecovery,		"username-recovery",		"intuit.ius.usernameRecovery"],
		[oiiWidgets.WIDGET_PASSWORD_RECOVERY, 	showPasswordRecovery,		"password-recovery",		"intuit.ius.passwordRecovery"]
	];

	// Define error codes.
	oiiWidgets.errorCodes = {};
	oiiWidgets.errorCodes.UNKNOWN = "UNKNOWN";
	oiiWidgets.errorCodes.LAUNCH_TIMEOUT = "LAUNCH_TIMEOUT";
	oiiWidgets.errorCodes.TARGET_NOT_FOUND = "TARGET_NOT_FOUND";
	oiiWidgets.errorCodes.ACCOUNT_PICKER = "ACCOUNT_PICKER";

	// Define public method for launching OII workflow.
	oiiWidgets.launch = function(params) {
		var errorMsg = '';
		// Verify that widget params were passed in.
		if( typeof params === 'undefined' ) {
			errorMsg = 'no parameters passed to oiiWidgets.launch()';
		} else {
			// Save the config params that were passed to us.
			WIDGET_PARAMS = params;

            if (oiiWidgets.scriptsLoaded === true) {
                addWidgetDivs();
                showWidget(WIDGET_PARAMS.startWidget);
                return;
            }

            // Check for other errors.
			if( typeof params.offeringId === 'undefined' ) {
				errorMsg = 'offeringId parameter not set';
			} else if( typeof params.oiiUrl === 'undefined' ) {
				errorMsg = 'oiiUrl parameter not set';
			} else if( typeof params.containerId === 'undefined' ) {
				errorMsg = 'containerId parameter not set';
			} else if( !document.getElementById(params.containerId) ) {
				errorMsg = '<div> element with id=' + params.containerId + ' (as specified by containerId parameter) not found';
			}
		}

		// If there's an error, bail out.
		if( errorMsg.length > 0 ) {
			errorMsg += ' - see documentation at top of oiiWidgets.js file for parameter descriptions.';
			log("*** Error ***  " + errorMsg);
			notifyError("oii", oiiWidgets.errorCodes.UNKNOWN, errorMsg);
			return;
		}

		// OII env id is not required, but we use it, so define it as null if it's not defined.
		if( typeof params.oiiEnv === 'undefined' ) {
			params.oiiEnv = null;
		}

		// Set defaults for parameters not provided.
		if( typeof params.useCurrentLogin === 'undefined' ) {
			params.useCurrentLogin = true;
		}
		if( typeof params.isSignin === 'undefined' ) {
			params.isSignin = false;
		}
		if( typeof params.isSignup === 'undefined' ) {
			params.isSignup = false;
		}
		if( typeof params.isMigration === 'undefined' ) {
			params.isMigration = false;
		}
		if( typeof params.isUpdate === 'undefined' ) {
			params.isUpdate = false;
		}
		if( typeof params.flow === 'undefined' ) {
			if( params.isSignin ) {
				params.flow = null; //"sign-in"; //TODO: Add back "sign-in" when this flow gets defined in OII backend.
			} else if( params.isSignup ) {
				params.flow = "sign-up";
			} else if( params.isMigration ) {
				params.flow = "migration";
			} else if( params.isUpdate ) {
				params.flow = "migration";
			} else {
				params.flow = null;
			}
		}
		if( typeof params.autoSignup === 'undefined' ) {
			params.autoSignup = false;
		}
		if( typeof params.allowAccountCreate === 'undefined' ) {
			params.allowAccountCreate = true;
		}
		if( typeof params.allowRealmCreate === 'undefined' ) {
			params.allowRealmCreate = true;
		}
		if( typeof params.showVerifyLogin === 'undefined' ) {
			params.showVerifyLogin = false;
		}
		if( typeof params.showSecurityUpgrade === 'undefined' ) {
			params.showSecurityUpgrade = false;
		}
		if( typeof params.userId === 'undefined' ) {
			params.userId = null;
		}
		if( typeof params.encryptedEmail === 'undefined' ) {
			params.encryptedEmail = null;
		}
		if( typeof params.unencryptedEmail === 'undefined' ) {
			params.unencryptedEmail = null;
		}
		if( typeof params.passwordRecoveryFinishUrl === 'undefined' ) {
			params.passwordRecoveryFinishUrl = null;
		}
		if( typeof params.passwordRecoveryContinue === 'undefined' ) {
			params.passwordRecoveryContinue = null;
		}
		if( typeof params.isEmailConfirmed !== 'boolean' ) {
			params.isEmailConfirmed = false;
		}

		// If link click functions are given, switch them out to call through local versions.
		// This lets us add logging and do any other post processing that we might need.
		WIDGET_FUNCTIONS = {};
		if( typeof params.onTermsOfServiceClick === 'undefined') {
			WIDGET_FUNCTIONS.onTermsOfServiceClick = null;
		} else {
			WIDGET_FUNCTIONS.onTermsOfServiceClick = onTermsOfServiceClick;
		}
		if( typeof params.onCustomerServiceClick === 'undefined') {
			WIDGET_FUNCTIONS.onCustomerServiceClick = null;
		} else {
			WIDGET_FUNCTIONS.onCustomerServiceClick = onCustomerServiceClick;
		}
		if( typeof params.onCreateAccountClick === 'undefined') {
			WIDGET_FUNCTIONS.onCreateAccountClick = null;
		} else {
			WIDGET_FUNCTIONS.onCreateAccountClick = onCreateAccountClick;
		}

		// Since we use the OII URL for more than just scripts, make sure the URL is just the base URL.
		if( WIDGET_PARAMS.oiiUrl.indexOf(PATH_SCRIPTS) >= 0 ) {
			WIDGET_PARAMS.oiiUrl =  WIDGET_PARAMS.oiiUrl.replace( PATH_SCRIPTS, "" );
		}

		// Do initializations.
		addScript();					// Add Javascript.
		addStyles();					// Add custom CSS styles.
		addWidgetDivs();				// Create the individual <div> elements for the OII widgets.

		log('oiiWidgets launched...waiting for OII scripts to load...');
		SCRIPT_LOAD_START_TIME = new Date();
		oiiWidgets.scriptsLoaded = false;
		oiiWidgets.loadScriptsTimeout = null;
		document.body.oniusWidgetScriptsLoaded = handleScriptsLoaded;	// Set handler for notification from OII code that scripts have loaded.

		//TODO: Verify that "scripts loaded" notification above works on all supported browsers.
		// For now, we'll rely on the "oniusWidgetScriptsLoaded" notification above.
		// If any problems are found, we can restore the wait mechanism below.
		//
		// Create list of widget-specific scripts that need to be loaded.
		// waitForScripts() will wait for all of these to load.
		//for(var i=0; i < DIV_DEFS.length; i++ ) {
		//	SCRIPTS_TO_LOAD.push( DIV_DEFS[i][ELEMENT_SCRIPT_OBJECT] );
		//}
		//waitForScripts();				// Set up timer to wait for scripts to load.
	}

	// Allow public access to showWidget function.
	// Client should use widget ID constants to pass the widgetId param, for example: oiiWidgets.showWidget(oiiWidgets.WIDGET_SIGN_IN)
	oiiWidgets.showWidget = function(widgetId) {
		showWidget(widgetId);
	}

	// Define public method for finding an element within a parent element.
	// This is needed because sometimes mulitple widgets exist within the DOM at the same time, and some element IDs
	// exist in multiple widgets. So when you do a normal document.getElementById(), you may not get the element in
	// the current widget.
	oiiWidgets.getChildElementById = function(parentId, childId, optionalChildTagName) {
		// If child tag name not given, default to all tags.
		if( !optionalChildTagName ) {
			optionalChildTagName = "*";
		}

		var foundChild = null;

		var parent = document.getElementById(parentId);
		var children = parent.getElementsByTagName(optionalChildTagName);
		for( var i = 0; i < children.length; i++ ) {
			var child = children[i];
			if( child.id === childId ) {
				foundChild = child;
				break;
			}
		}

		return foundChild;
	}

	// Show/Hide the OII loader animation.
	oiiWidgets.showWait = function() {
		showLoaderAnimation();
	}
	oiiWidgets.hideWait = function() {
		hideLoaderAnimation();
	}

	// Hide any widget that is currently visible.
	oiiWidgets.hideWidget = function() {
		// Get client's container <div> for the widgets.
		var oiiDivContainer = document.getElementById(WIDGET_PARAMS.containerId);
		if( oiiDivContainer ) {
			// Get list of individual OII widget <div> elements.
			var oiiDivList = oiiDivContainer.getElementsByTagName("div");
			if( oiiDivList ) {
				// Go through the widget <div> elements and hide any that are visible.
				for( var i=0; i < oiiDivList.length; i++ ) {
					var oiiDiv = oiiDivList[i];
					if( oiiDiv && oiiDiv.className && oiiDiv.className === "ius-widget-div" && oiiDiv.style && oiiDiv.style.display === "block") {
						oiiDiv.style.display = "none";
					}
				}
			}
		}
	}

	//-------------------------------------------------------------------------
	//---   Private functions
	//-------------------------------------------------------------------------

	// Helper function to call master widget's onUpdate callback.
	// This is called to notify the client that a widget has updated it's content, typically at the initial load of the widget.
	function notifyUpdate(widgetId, info) {
		if( !info ) {
			info = {};
		}
		if( WIDGET_PARAMS.onUpdate) {
			WIDGET_PARAMS.onUpdate(widgetId, info);
		}
	}

	// Helper function to call master widget's onNotify callback.
	// This is called to notify the client of interesting activity other than a widget being displayed (e.g., select of an account).
	function notifyInfo(widgetId, info) {
		if( WIDGET_PARAMS.onNotify ) {
			WIDGET_PARAMS.onNotify(widgetId, info);
		}
	}

	// Helper function to call master widget's onFinish callback.
	// This is called to notify the client that the widget workflow has completed.
	// If no realm was selected, realmId, grantInfo, autoCreated, and userData will not be set.
	// If a realm is selected, grantInfo will only be set for applications for which we can interpret grant info (e.g., only QBO at initial launch).
	// autoCreated is true if the realm picker widget automatically created the realm.
	function notifyFinish(widgetId, realmId, grantInfo, autoCreated, userData) {
		showLoaderAnimation();
		if( !realmId ) {
			log("Exiting with no RealmID because no account was found for user-entered email address.");
		}
		WIDGET_PARAMS.onFinish(realmId, grantInfo, autoCreated, userData);
	}

	// Helper function to call master widget's onError callback.
	// This is called when an unrecoverable error has occurred - usually due to incorrect parameters being passed to the master widget launch() function.
	function notifyError(widgetId, errorCode, errorMsg) {
		if( WIDGET_PARAMS.onError ) {
			WIDGET_PARAMS.onError(widgetId, errorCode, errorMsg);
		}
	}

	// Callback for direct notification from OII that all scripts have loaded.
	// When oiiWidgets.launch() is called, we set up this handler to get notified when the internal OII
	// widgets have all loaded. This gets called internally by OII. When that happens, we can proceed
	// with the widget workflow.
	function handleScriptsLoaded() {
		// If scripts already loaded from wait loop, no need to start workflow here.
		if( !oiiWidgets.scriptsLoaded ) {
			log( "Received notification for scripts loaded...starting workflow..." );
			startWorkflow();
		} else {
			log( "Received notification for scripts loaded...scripts already loaded." );
		}
	}

	// Wait for all OII scripts to load before proceeding with widget workflow.
	// This was the original implementation of "waiting for OII scripts to load" before I knew about the oniusWidgetScriptsLoaded
	// event. Now that we have that set to call handleScriptsLoaded() above, we no longer need this. However, I'm a little worried
	// about how well supported oniusWidgetScriptsLoaded will be across different browsers, so I'm keeping this code around in case
	// we need to revive it.
	/*------------------------------------------------------------------------------------------------------------------
	function waitForScripts() {
		var WAIT_TIME = 200;
		// If scripts already loaded, no need to continue.
		if( oiiWidgets.scriptsLoaded ) {
			log("Interrupted wait loop...script load notification received.");
			return;
		}

		// Keep track of how many times we've waited.
		// After several tries, stop waiting.
		if( LOAD_DELAY_COUNT++ > oiiWidgets.loadDelayCount ) {
			log("*** ERROR ***  OII scripts not loaded (make sure oiiUrl parameter is correct)");
			notifyError("oii", oiiWidgets.errorCodes.LAUNCH_TIMEOUT, "OII scripts not loaded");
			return;
		}

		// If common OII scripts not yet loaded, wait a bit and try again.
		if( typeof intuit === 'undefined'
			|| typeof intuit.ius === 'undefined'
			|| typeof intuit.ius.apis === 'undefined' ) {
			log("OII scripts not yet loaded, waiting some more...");
			oiiWidgets.loadScriptsTimeout = window.setTimeout(waitForScripts,WAIT_TIME);
			return;
		}

		// Make sure widget-specific scripts are loaded.
		try {
			// If there are still widgets for which we're waiting on scripts to load, see if they're loaded yet.
			while( SCRIPTS_TO_LOAD.length > 0 ) {
				// Get the next script object (created by OII code)
				var scriptObjectName = SCRIPTS_TO_LOAD[0];
				var scriptObject = eval(scriptObjectName);
				// If script object or its "setup" method isn't loaded yet, wait a bit and try again.
				if( typeof scriptObject === 'undefined' || scriptObject === null || typeof scriptObject.setup === 'undefined' ) {
					log("OII script for " + scriptObjectName + " not yet loaded, waiting some more...");
					oiiWidgets.loadScriptsTimeout = window.setTimeout(waitForScripts,WAIT_TIME);
					return;
				}
				// If script object is fully loaded, remove it from the list of objects we're waiting on. Then try the next one.
				else {
					log("OII script for " + scriptObjectName + " loaded");
					SCRIPTS_TO_LOAD.splice(0,1);
				}
			}
		} catch(ex) {
			log("*** ERROR ***  exception while checking that scripts loaded (" + ex.message + ")");
			notifyError("oii", oiiWidgets.errorCodes.UNKNOWN, "exception loading scripts (" + ex.message + ")");
			return;
		}

		// If all scripts loaded, proceed with widget workflow.
		startWorkflow();
	}
	------------------------------------------------------------------------------------------------------------------*/

	// Start display of OII widget workflow (delayed until after OII Javascript has loaded)
	function startWorkflow() {
		// When we reach this point, all necessary scripts should be loaded.
		// So clear all "wait for scripts" setup that was previously done.
		oiiWidgets.scriptsLoaded = true;
		document.body.oniusWidgetScriptsLoaded = null;
		if( oiiWidgets.loadScriptsTimeout ) {
			window.clearTimeout( oiiWidgets.loadScriptsTimeout );
			oiiWidgets.loadScriptsTimeout = null;
		}

		SCRIPT_LOAD_TOTAL_TIME = getElapsedTime(SCRIPT_LOAD_START_TIME);
		log("OII scripts loaded: loadTime=" + SCRIPT_LOAD_TOTAL_TIME);

		// Get GLogin cookie info.
		GLOGIN_COOKIE_NAME = 'qbn.'+intuit.ius.env+'glogin';
		try {
			GLOGIN_COOKIE_VALUE = intuit.ius.storage.getItem(GLOGIN_COOKIE_NAME);
			if( GLOGIN_COOKIE_VALUE && GLOGIN_COOKIE_VALUE.length == 0 ) {
				GLOGIN_COOKIE_VALUE = null;
			}
		} catch(ex) {
			GLOGIN_COOKIE_VALUE = null;
		}

		// Warn if not using HTTPS.
		if( window && window.location && window.location.href && window.location.href.indexOf("https") !== 0 ) {
			log("*** Warning ***  OII widgets require HTTPS");
		}

		// If param set to NOT use current login, clear any current login.
		LOGIN_CHECK_START_TIME = new Date();
		if( !WIDGET_PARAMS.useCurrentLogin) {
			log("*** Clearing IAM login (based on useCurrentLogin=false)");
			intuit.ius.apis.removeSecurityToken({
				offeringId : WIDGET_PARAMS.offeringId,
				offeringEnv : WIDGET_PARAMS.oiiEnv
			});
		}

		// Proceed with workflow.
		// If client opted to not use current login (via param), go immediately to workflow for not-logged-in user.
		if( !WIDGET_PARAMS.useCurrentLogin ) {
			log("Launch workflow - ignore current login");
			doWorkflow(false);
		}
		// Otherwise, launch workflow based on whether or not user is logged in.
		else {
			// Use internal OII function to check login status.
			log("Launch workflow - check current login");
			intuit.ius.apis.verifySecurityToken({
				offeringId: WIDGET_PARAMS.offeringId,
				offeringEnv: WIDGET_PARAMS.oiiEnv,
				async: true,
				done: function() { doWorkflow(true); },
				fail: function() { doWorkflow(false); }
			});
		}
	}

	/**
	 * Launch OII widget workflow based on whether or not user is logged in.
	 * @param isLoggedIn: true if user logged in, false if not
	 */
	function doWorkflow(isLoggedIn) {
		// Set info that client can log to record initial status of widget invocation.
		var nextWidget = null;
		var isEmailConfirmed = WIDGET_PARAMS.isEmailConfirmed ? "true" : "false";
		var haveEncryptedEmail = (WIDGET_PARAMS.encryptedEmail === null) ? "false" : "true";
		var loginCheckTotalTime = getElapsedTime(LOGIN_CHECK_START_TIME);
		log("Start workflow - loginCheckTime=" + loginCheckTotalTime);
		var info = {
			trigger:"startWorkflow",
			glogin:GLOGIN_COOKIE_VALUE,
			useCurrentLogin:WIDGET_PARAMS.useCurrentLogin,
			isLoggedIn:isLoggedIn,
			showVerifyLogin:WIDGET_PARAMS.showVerifyLogin,
			isEmailConfirmed:isEmailConfirmed,
			haveEncryptedEmail:haveEncryptedEmail,
			scriptLoadTime:SCRIPT_LOAD_TOTAL_TIME,
			loginCheckTime:loginCheckTotalTime
		};

		if( WIDGET_PARAMS.isSignin ) {
			info["workflow"] = "signin";
		} else if( WIDGET_PARAMS.isSignup ) {
			info["workflow"] = "signup";
		} else if( WIDGET_PARAMS.isMigration ) {
			info["workflow"] = "migration";
		} else if ( WIDGET_PARAMS.isUpdate ) {
			info["workflow"] = "update";
		} else {
			info["workflow"] = "none";
		}
		info["flowParam"] = WIDGET_PARAMS.flow;

		// If client specified an override for which widget to start with, go immediately to that widget.
		if( typeof WIDGET_PARAMS.startWidget === 'string' && WIDGET_PARAMS.startWidget.length > 0 ) {
			log("Launch workflow - startWidget override = " + WIDGET_PARAMS.startWidget);
			info["startOverride"] = WIDGET_PARAMS.startWidget;
			nextWidget = WIDGET_PARAMS.startWidget;
		}
		// Otherwise, determine the starting widget for a logged-in user.
		else if( isLoggedIn ) {
			log("user logged in: showVerifyLogin=" + WIDGET_PARAMS.showVerifyLogin);
			// If user logged in, we always skip the Account Picker.
			// If verify login is requested (to make sure user wants to use current login), go to Sign In widget for login verification.
			if( WIDGET_PARAMS.showVerifyLogin ) {
				nextWidget = oiiWidgets.WIDGET_SIGN_IN;
			}
			// For "update" workflow", verify login is turned off, but we still want to start with sign-in.
			else if( WIDGET_PARAMS.isUpdate ) {
				nextWidget = oiiWidgets.WIDGET_SIGN_IN;
			}
			// Otherwise, skip verification and go straight to Realm Picker.
			else {
				nextWidget = oiiWidgets.WIDGET_REALM_PICKER;
			}
		}
		// Handle sign-in workflow.
		else if( WIDGET_PARAMS.isSignin ) {
			log("user not logged in: isSignin=true, isEmailConfirmed=" + isEmailConfirmed  + ", haveEncryptedEmail=" + haveEncryptedEmail + ", glogin=" + (GLOGIN_COOKIE_VALUE || "null"));
			// If we have an encrypted email, account-picker can use it to find accounts.
			if( WIDGET_PARAMS.encryptedEmail ) {
				nextWidget = oiiWidgets.WIDGET_ACCOUNT_PICKER;
			}
			// Otherwise, go straight to sign-in widget.
			else {
				nextWidget = oiiWidgets.WIDGET_SIGN_IN;
			}
			/* Keeping this around in case we need to lookup email addresses.
				intuit.ius.apis.lookupAccountByEmailAddress({
					offeringId: WIDGET_PARAMS.offeringId,
					offeringEnv: WIDGET_PARAMS.offeringEnv,
					email : data.getEmail(),
					isEmailEncrypted : data.getIsEmailEncrypted(),
					done: function(response) { events.onFindAccountSuccess(response); },
					fail: function(response) { events.onFindAccountFailed(response); }
				});
			*/
		}
		// Determine the starting widget for a not-logged-in user.
		else {
			log("user not logged in: isSignup=" + WIDGET_PARAMS.isSignup + ", isEmailConfirmed=" + isEmailConfirmed  + ", haveEncryptedEmail=" + haveEncryptedEmail + ", glogin=" + (GLOGIN_COOKIE_VALUE || "null"));
			// For sign-up workflow, always go to Account Picker.
			if( WIDGET_PARAMS.isSignup ) {
				// Account Picker will show account list if encrypted email passed in.
				// Otherwise, it will prompt for email and then go to sign-in.
				nextWidget = oiiWidgets.WIDGET_ACCOUNT_PICKER;
			}
			// For non-sign-up workflows...
			// ... if GLOGIN cookie is set, go to sign-in (user ID will be pre-filled from GLOGIN cookie).
			else if( GLOGIN_COOKIE_VALUE ) {
				nextWidget = oiiWidgets.WIDGET_SIGN_IN;
			}
			// ...if email not provided or is not confirmed, skip Account Picker and go to sign-in.
			else if( !WIDGET_PARAMS.encryptedEmail || !WIDGET_PARAMS.isEmailConfirmed ) {
				nextWidget = oiiWidgets.WIDGET_SIGN_IN;
			}
			// ... otherwise, go to Account Picker (which will use provided email).
			else {
				nextWidget = oiiWidgets.WIDGET_ACCOUNT_PICKER;
			}
		}

		if( nextWidget ) {
			info["nextWidget"] = nextWidget.replace("ius-","").replace("-widget","");	// Strip extraneous prefix and suffix from widget ID for logging purposes
		} else {
			info["nextWidget"] = null;
		}
		notifyInfo("start", info);
		if( nextWidget !== null ) {
			showWidget(nextWidget);
		}
	}

	// Add script tag for OII Javascript.
	// This dynamically adds the Javascript needed to embed OII widgets on a page. For example:
	//    <script src="https://accounts-e2e.intuit.com/IUS-Plugins/scripts/ius.js" id="ius-script" data-widgets="sign-in,sign-up,realm-picker,account-picker"></script>
	function addScript() {
		var docHead = getDocumentHead();
		var dataWidgets = null;
		var scriptTag = document.createElement('script');
		scriptTag.setAttribute("type","text/javascript");
		scriptTag.setAttribute("src", WIDGET_PARAMS.oiiUrl + PATH_SCRIPTS);
		scriptTag.setAttribute("id", "ius-script");

		// Build the list of widget IDs for the data-widgets attribute.
		for(var i=0; i < DIV_DEFS.length; i++ ) {
			var scriptId = DIV_DEFS[i][ELEMENT_SCRIPT_ID];
			if( scriptId !== null && scriptId.length > 0 ) {
				if( dataWidgets == null ) {
					dataWidgets = "";
				} else {
					dataWidgets += ",";
				}
				dataWidgets += scriptId;
			}
		}
		scriptTag.setAttribute("data-widgets",dataWidgets);

		// Add script.
		if( docHead ) {
			docHead.appendChild(scriptTag);
		} else {
			log("*** ERROR *** addScript: script target not found");
			notifyError("oii", oiiWidgets.errorCodes.TARGET_NOT_FOUND, "error adding OII scripts");
		}
	}

	// Add custom CSS styles.
	function addStyles() {
		var docHead = getDocumentHead();

		function buildStyleText(selector, style) {
			return selector + "{" + style + "} ";
		}

		if( docHead ) {
			var styleSheet = document.createElement("style");
			styleSheet.type = "text/css";
			var cssText = buildStyleText( "#loaderAnimation", "margin-top:20px; margin-bottom:20px; text-align:center;" );
			cssText += buildStyleText( ".ius input[type=email]", "width:300px;" );
			cssText += buildStyleText( ".ius input[type=text]", "width:300px;" );
			cssText += buildStyleText( ".ius input[type=password]", "width:300px;" );
			cssText += buildStyleText( "#ius-sign-up-terms-of-use", "font-size:.9em; padding-top:10px;" );
			docHead.appendChild(styleSheet);
			if( styleSheet.styleSheet ) {
				styleSheet.styleSheet.cssText = cssText;
			} else {
				styleSheet.appendChild(document.createTextNode(cssText));
			}
		} else {
			log("*** ERROR *** addStyles: script target not found");
			notifyError("oii", oiiWidgets.errorCodes.TARGET_NOT_FOUND, "error adding styles");
		}

		// Add class to main widget container to allow styling by external style definition (e.g., oiiWidgets.css).
		var divContainer = document.getElementById(WIDGET_PARAMS.containerId);
		if( divContainer ) {
			var iusContainerClass = "ius-container";
			var className = divContainer.className;
			// If container already has a class, append the class name.
			if( className != null && className.length > 0 ) {
				// But don't add it if it's already set.
				if( className.indexOf(iusContainerClass) === -1 ) {
					divContainer.className += (" " + iusContainerClass);
				}
			}
			// If container doesn't yet have a class, set it.
			else {
				divContainer.className = iusContainerClass;
			}
		}
	}

	// Add individual <div> containers for the OII widgets.
	function addWidgetDivs() {
		// Get the container <div> defined by the client to hold the OII widgets.
		var oiiContainer = document.getElementById(WIDGET_PARAMS.containerId);
		if( !oiiContainer ) {
			log("*** ERROR *** addWidgetDivs: container not found (containerId="+WIDGET_PARAMS.containerId+")");
			notifyError(WIDGET_PARAMS.containerId, oiiWidgets.errorCodes.TARGET_NOT_FOUND, "widget container not found (containerId=" + WIDGET_PARAMS.containerId+")");
		}
		// Define <div> IDs and setup functions for the OII widgets.
		// Create a <div> element for each OII widget.
		else {
			// Add loader animation.
			var loaderAnimationDiv = document.createElement("div");
			var loaderAnimation = document.createElement("img");
			loaderAnimationDiv.setAttribute( "id", "loaderAnimation" );
			loaderAnimation.setAttribute( "src", WIDGET_PARAMS.oiiUrl + PATH_LOADER_ANIMATION);
			loaderAnimationDiv.appendChild(loaderAnimation);
			oiiContainer.appendChild(loaderAnimationDiv);
			showLoaderAnimation();

			// Add individual widgets.
			for(var i=0; i < DIV_DEFS.length; i++) {
				var divId = DIV_DEFS[i][ELEMENT_DIV_ID];			// Get this widget's <div> id.
				var divFunction = DIV_DEFS[i][ELEMENT_FUNCTION];	// Get this widget's display function (defined below).
				var newDiv = document.createElement("div");			// Create the <div>.
				newDiv.setAttribute( "id", divId );					// Set it's attribute to the value required by the OII widget implementation.
				newDiv.setAttribute( "isWidget", "true" );			// Mark as a widget DIV.
				newDiv.className = "ius-widget-div";				// CSS class to allow styling.
				newDiv.showFunction = divFunction;					// Set pointer to the display function (defined below).
				oiiContainer.appendChild(newDiv);					// Add the widget's <div> to the client's container <div>.
				log( "added " + divId);
			}

			// Add "clearing" div to prevent alignment issues due to floating content within widget DIVs.
			var clearingDiv = document.createElement("div");
			clearingDiv.id = "clearingDiv";
			clearingDiv.style.display = "block";
			clearingDiv.style.clear = "both";
			oiiContainer.appendChild(clearingDiv);
		}
	}

	// Private function to get document head element.
	function getDocumentHead() {
		var docHead = null;
		var headTags = document.getElementsByTagName("head");
		if( headTags && headTags.length > 0 ) {
			docHead = headTags[0];
		} else if( document.documentElement ) {
			docHead = document.documentElement;
		}
		return docHead;
	}

	// Check for needed workflow changes and return new Widget ID if we need to change the next widget.
	function modifyWorkFlow(widgetId) {
		var originalId = widgetId;
		// If we're going to Security Level widget and client params do not indicate that this should be shown,
		// go directly to the Realm Picker widget instead.
		if( widgetId === oiiWidgets.WIDGET_SECURITY_LEVEL ) {
			if( !WIDGET_PARAMS.showSecurityUpgrade ) {
				widgetId = oiiWidgets.WIDGET_REALM_PICKER;
			}
		}
		if( widgetId !== originalId ) {
			log("modifyWorkFlow: redirected " + originalId + " to " + widgetId);
		}
		return widgetId;
	}

	// Display the widget with the given ID.
	function showWidget(widgetId) {
		log("Navigating to " + widgetId);
		var widgetDisplayFunction = null;
		var showingDiv = null;
		var hidingDiv = null;
		// Get client's container <div> for the widgets.
		var oiiDivContainer = document.getElementById(WIDGET_PARAMS.containerId);
		if( oiiDivContainer ) {
			// Get list of individual OII widget <div> elements.
			var oiiDivList = oiiDivContainer.getElementsByTagName("div");
			if( oiiDivList ) {
				// Pick up any needed changes to workflow.
				widgetId = modifyWorkFlow(widgetId);
				// Go through the widget <div> elements and hide the ones we're not using and show the one we are using.
				for( var i=0; i < oiiDivList.length; i++ ) {
					var oiiDiv = oiiDivList[i];
					// If this is the widget DIV we're showing, make it visible.
					// Also grab the display function pointer for this widget.
					if( oiiDiv.id === widgetId ) {
						showingDiv = oiiDiv;
						showLoaderAnimation();
						oiiDiv.style.display = "block";
						widgetDisplayFunction = oiiDiv.showFunction;
					}
					// Otherwise, hide it if it's a widget DIV.
					else if( oiiDiv.getAttribute("isWidget") ) {
						oiiDiv.style.display = "none";
					}
				}
			} else {
				log("*** ERROR *** showWidget: div tags not found (containerId="+WIDGET_PARAMS.containerId+")");
				notifyError(WIDGET_PARAMS.containerId+".div", oiiWidgets.errorCodes.TARGET_NOT_FOUND, "div tags not found");
			}
		} else {
			log("*** ERROR *** showWidget: container not found (containerId="+WIDGET_PARAMS.containerId+")");
			notifyError(WIDGET_PARAMS.containerId, oiiWidgets.errorCodes.TARGET_NOT_FOUND, "widget div not found");
		}

		// Call the display function for this widget (defined below).
		if( widgetDisplayFunction ) {
			widgetDisplayFunction(widgetId);
		} else {
			log("*** ERROR ***  widget " + widgetId + " not defined");
			notifyError(widgetId, oiiWidgets.errorCodes.TARGET_NOT_FOUND, "widget info not defined");
		}
	}

	// Show "loading" animation in given widget.
	function showLoaderAnimation() {
		var currentAnimation = document.getElementById("loaderAnimation");
		if( currentAnimation ) {
			currentAnimation.style.display = "block";
		}
	}

	// Hide "loading" animation
	function hideLoaderAnimation() {
		var currentAnimation = document.getElementById("loaderAnimation");
		if( currentAnimation ) {
			currentAnimation.style.display = "none";
		}
	}

	// Common functionality to run every time a widget gets displayed.
	function handleWidgetLoad(widgetId, info) {
		log("Loaded widget id=" + widgetId);
		assignIdsToElements(widgetId);

		// Update widget ID info.
		oiiWidgets.previousWidgetId = oiiWidgets.currentWidgetId;
		oiiWidgets.currentWidgetId = widgetId;

		// Add previous widget id to info.
		if( !info ) {
			info = {};
		}
		if( oiiWidgets.previousWidgetId ) {
			info['previousWidgetId'] = oiiWidgets.previousWidgetId;
		} else {
			info['previousWidgetId'] = null;
		}

		// Notify client that an OII widget has been loaded.
		notifyUpdate(widgetId, info);

		// Once widget is loaded, the "loading" animation needs to be hidden.
		hideLoaderAnimation();
	}

	// Display message to browser's developer console.
	function log(logMessage) {
		if( typeof console !== 'undefined' && console && console.log ) {
			console.log("oiiWidgets: "+logMessage);
		}
	}

	// Calculate elapsed time in milliseconds between now and the giventime.
	function getElapsedTime(startTime) {
		var elapsedTime = -1;
		if( typeof startTime === 'object' && startTime.valueOf ) {
			var currentTime = new Date();
			elapsedTime = currentTime.valueOf() - startTime.valueOf();
		}
		return elapsedTime;
	}

	// Different widgets have different fields for entry of a "user name".
	// Look for these different fields to see if any exist and have a value entered.
	function getUserNameFromField() {
		var userName = "";

		var userNameField = document.getElementById("ius-sign-in-username");
		if( !userNameField ) {
			userNameField = document.getElementById("ius-email");
		}
		if( userNameField && userNameField.value ) {
			userName = userNameField.value;
		}

		return userName;
	}

	// Determine if HTML element with given ID is visible.
	function isVisible(id) {
		var element = document.getElementById(id);
		if( element && element.offsetHeight ) {
			return true;
		} else {
			return false;
		}
	}

	// Convert a string to a value that can be used for an HTML element's ID value.
	// For example, we take the text of a button element (like "Try Again") and use it to generate
	// and ID for the button like "try-again".
	function convertToId(value) {
		try {
			value = value.toLowerCase();			// Make all lowercase.
			value = value.replace("'", "");			// Remove any apostrophes.
			value = value.replace(/[^a-z]+/g, "-");	// Convert non-letter characters to a "-" separator.
			value = value.replace(/^-|-$/g,"");		// Remove any newly created separator at beginning or end of text.
		} catch(e) {};
		return value;
	}

	// For QA automation, we need HTML elements to have ID values assigned.
	// This function iterates through the elements of a widget and generates IDs for elements that don't yet have them.
	function assignIdsToElements(parentId) {
		// Assign IDs to elements that don't have them (to enable QA automation)
		var parent = document.getElementById(parentId);
		if( !parent ) return;

		// Generate an ID prefix based on the widget ID.
		var prefix = parentId.replace("ius-", "");
		prefix = prefix.replace("-widget", "");

		var buttonIndex = 1;
		var radioIndex = 1;

		// Assign IDs to BUTTON elements.
		var buttons = parent.getElementsByTagName("button");
		if( buttons && buttons.length && buttons.length > 0 ) {
			for(var index=0; index < buttons.length; index++ ) {
				var element = buttons[index];
				if( element.getAttribute("id") ) continue; // If element already has an id, skip to next element.
				var id = null;
				// If element has a name, create button ID from that.
				var name = element.getAttribute("name");
				if( name ) {
					id = name + "-btn";
				}
				// If element's parent has an ID, create button ID from that.
				else if( element.parentElement && element.parentElement.getAttribute("id") ) {
					id = element.parentElement.getAttribute("id") + "-btn";
				}
				// Otherwise, use widget's ID as a prefix.
				else {
					id = prefix + "-btn" + (buttonIndex++);
				}
				// Assign the generated ID.
				element.setAttribute("id", name);
			}
		}

		// Assign IDs to INPUT elements.
		var inputs = parent.getElementsByTagName("input");
		if( inputs && inputs.length && inputs.length > 0 ) {
			// Allow for sequential numbering of radio buttons by name.
			// For example if there is one set of radio buttons with name="myRadio" and another set with name="yourRadio",
			// set IDs to myRadio1, myRadio2, etc. and yourRadio1, yourRadio2, etc.
			var radioIndexByName = {};
			for(var index=0; index < inputs.length; index++ ) {
				var element = inputs[index];
				if( element.getAttribute("id") ) continue; // If element already has an id, skip to next element.
				var id = null;
				var type = element.getAttribute("type") || "text";
				// For buttons...
				if( type === "button" || type === "submit" ) {
					var name = element.getAttribute("name");
					var value = element.getAttribute("value");
					// If element has a name, generate ID from that.
					if( name ) {
						id = name + "-btn";
					}
					// If element has a value, generate ID from that.
					else if( value ) {
						id = convertToId(value) + "-btn";
					}
					// Otherwise, generate a sequentially numbered ID using the widget's ID as a prefix.
					else {
						id = prefix + "-input" + buttonIndex + "-btn";
						buttonIndex++;
					}
				}
				// For radio buttons...
				else if( type === "radio" ) {
					var name = element.getAttribute("name");
					// If element has a name, generate ID from that.
					if( name ) {
						// Generate sequential numbering for each different name.
						if( !radioIndexByName[name] ) {
							radioIndexByName[name] = 1;
						}
						id = name + (radioIndexByName[name]++);
					}
					// Otherwise, generate a sequentially numbered ID using the widget's ID as a prefix.
					else {
						id = prefix + "-radio" + (radioIndex++);
					}
				}
				// If we didn't generate ID yet, generate a generic input ID.
				if( !id ) {
					id = prefix + "-input" + (index+1);
				}
				// Assign the generated ID.
				element.setAttribute("id", id);
			}
		}

		// Assign IDs to anchor tags.
		var anchors = parent.getElementsByTagName("a");
		if( anchors && anchors.length && anchors.length > 0 ) {
			for(var index=0; index < anchors.length; index++ ) {
				var element = anchors[index];
				if( element.getAttribute("id") ) continue; // If element already has an id, skip to next element.
				var id = null;
				// If parent has an "ius-" id, use that to create link id.
				if( element.parentElement && element.parentElement.getAttribute("id") && element.parentElement.getAttribute("id").indexOf("ius-") == 0 ) {
					id = element.parentElement.getAttribute("id") + "-link";
				}
				// Otherwise, create id from link text.
				else if( element.innerText ) {
					var text = element.innerText;
					id = convertToId(text) + "-link";
				}
				if( !id ) {
					id = prefix + "-link" + (index+1);
				}
				// Assign the generated ID.
				element.setAttribute("id", id);
			}
		}

		// Assign IDs to buttons implemented as a SPAN.
		var spans = parent.getElementsByTagName("span");
		if( spans && spans.length && spans.length > 0 ) {
			for(var index=0; index < spans.length; index++ ) {
				var element = spans[index];
				var classOfElement = element.className;
				// If this SPAN is not a button, skip to next element.
				if( !classOfElement || classOfElement.indexOf("ius-btn") < 0 ) continue;
				if( element.getAttribute("id") ) continue; // If element already has an id, skip to next element.
				var id = null;
				var name = element.getAttribute("name");
				// If element has a name, generate ID from that.
				if( name ) {
					id = name + "-btn";
				}
				// If element has text, generate an ID from that.
				else if( element.innerText ) {
					var text = element.innerText;
					id = convertToId(text) + "-btn";
				}
				// Otherwise generate a sequentially numbered ID using widget ID as a prefix.
				else {
					id = prefix + "-btn" + (buttonIndex++);
				}
				// Assign the generated ID.
				element.setAttribute("id", id);
			}
		}

	}

	// Count number of selection items in widget list (e.g., number of accounts in account list or realms in realm list).
	function getListCount(div) {
		var count = 0;
		if( div ) {
			var inputList = div.getElementsByTagName("input");
			if( inputList && inputList.length > 0 ) {
				for(var i=0; i < inputList.length; i++) {
					var input = inputList[i];
					if( input.type && input.type == "radio" ) {
						count++;
					}
				}
			}
		}
		return count;
	}

	// Extract string of values from enclosing curly braces or quotes of a JSON string.
	// The JSON will be from a widget's internal response object.
	function extractValuesFromJSON(val) {
		var len = val.length;
		// If value is contained in curly braces, remove the braces.
		if( val.charAt(0) === '{' && val.charAt(len-1) === '}' ) {
			return val.substr(1,len-2);
		}
		// If value is contained in quotes, remove the quotes.
		else if( val.charAt(0) === '"' && val.charAt(len-1) === '"' ) {
			return val.substr(1,len-2);
		}
		return val;
	}

	// Create an object from a string of properties.
	// This is used to extract values from a JSON string that has had its curly braces removed,
	// so something like: "prop1:var1, prop2:var2".
	function stringListToObject(list) {
		var obj = null;

		try {
			var arr = new Array();
			// If this looks like a comma-separated list, parse into an array.
			if( list.indexOf(",") > 0 ) {
				arr = list.split(",");
			}
			// Otherwise, assume it's a single element and add it to array.
			else {
				arr.push(list);
			}
			// Process each element of list.
			for(var i=0; i < arr.length; i++) {
				var element = arr[i];
				// If element looks like a JSON property, parse it.
				if( element.indexOf(":") > 0 ) {
					var props = element.split(":");
					// If parsing worked, assign property.
					if( props && props.length === 2 ) {
						if( !obj ) obj = {}; // Initialize object the first time we have a property to assign.
						var propName = extractValuesFromJSON(props[0]);
						var propVal  = extractValuesFromJSON(props[1]);
						obj[propName] = propVal;
					}
				}
			}
		} catch(e) {}

		return obj;
	}

	// Several of our Javascript callback functions get passed an "info" object that contains properties relevant to that call.
	// In some cases, we're generating "info" properties from a widget's internal response object, which is sometimes an
	// actual Javascript object, but is sometimes a string containing JSON (like "{prop1:val1, prop2:val2}"). This method
	// handles both cases to add values from the response object as properties of the "info" object.
	function addResponseProperties(info, response) {
		// Get response text from given response.
		var responseText = "";
		// If given response is an object, get it's response text property.
		if( typeof response === "object" ) {
			if( typeof response.responseText === "string" ) {
				responseText = response.responseText;
			}
		}
		// If given reponse is a string, assume it's already the response text.
		else if( typeof response === "string" ) {
			responseText = response;
		}

		// Parse response text into an object.
		var responseObj = {};
		// If response text starts with a "{", assume it's a JSON string and remove the braces.
		if( responseText.charAt(0) === "{" ) {
			responseText = extractValuesFromJSON(responseText);
		}
		// Hopefully we now have a comma-separated list of properties.
		// Parse the string list into an object.
		responseObj = stringListToObject(responseText);

		// If we got an object of response properties, copy the properties to the info object.
		if( typeof responseObj === "object" && responseObj ) {
			for(var prop in responseObj ) {
				info[prop] = responseObj[prop];
			}
		} else {
			info["response"] = responseText;
		}
	}

	// Find an HTML element by tag name within a sub-element of a widget.
	function findTagInWidget(widgetId, parentId, tagName) {
		// Get the widget element and make sure we got it.
		var widget = document.getElementById(widgetId);
		if( !widget ) {
			return null;
		}

		// Get the "parent" object within the widget that contains the tag we're looking for.
		var parent = null;
		var childList = widget.getElementsByTagName("*");
		if( childList && childList.length > 0 ) {
			for(var i=0; i < childList.length; i++) {
				var element = childList[i];
				if( element && element.id && element.id === parentId ) {
					parent = element;
					break;
				}
			}
		}
		if( !parent ) {
			return null;
		}

		// Get the anchor tag within the parent object.
		var tag = null;
		var tagList = parent.getElementsByTagName(tagName);
		if( tagList && tagList.length > 0 ) {
			tag = tagList[0];
		}

		return tag;
	}

	// Change an anchor tag in a widget to invoke a Javascript function instead of a URL.
	function setLinkToCallback(widgetId, parentId, callback) {
		// Find the anchor tag.
		// Assumes this is an anchor tag that is a direct descendant of a known element, identified with the "parentId".
		var link = findTagInWidget(widgetId, parentId, "a");
		if( !link ) {
			return;
		}

		// If callback function was given, set link to invoke the callback.
		if( callback ) {
			var handlerFunction = function(){callback(widgetId); return false;};
			link.setAttribute( "href", "#");
			link.onclick = handlerFunction;
			var parent = document.getElementById(parentId);
			if( parent && parent.style ) {
				parent.style.display = "block";
			}
		}
		// If callback was not given, or was null, hide the link and its parent.
		else  {
			var parent = document.getElementById(parentId);
			if( parent && parent.style ) {
				parent.style.display = "none";
			}
		}
	}

	// Set the content of a widget element to the given HTML.
	function setWidgetElementHtml(widgetId, parentId, tagName, html) {
		var tag = findTagInWidget(widgetId, parentId, tagName);
		if( tag && tag.innerHTML ) {
			tag.innerHTML = html;
		}
	}


	//-------------------------------------------------------------------------
	//---   Widget definitions
	//-------------------------------------------------------------------------

	//----- Common handlers for widgets -----

	function onUserIdRecoveryClick(widgetId) {
		if( !oiiWidgets.isLoadingWidget ) {
			var userName = getUserNameFromField();
			if( userName ) {
				oiiWidgets.userNamePrefill = userName; // Save user-entered email/userID to pre-fill on next widget.
			}

			log('"UserName Recovery" clicked');
			notifyInfo(widgetId, {trigger:"click", link:"userNameRecovery"});
			showWidget(oiiWidgets.WIDGET_USERNAME_RECOVERY);
		}
	}

	function onPasswordRecoveryClick(widgetId) {
		if( !oiiWidgets.isLoadingWidget ) {
			var userName = getUserNameFromField();
			if( userName ) {
				oiiWidgets.userNamePrefill = userName; // Save user-entered email/userID to pre-fill on next widget.
			}

			log('"Password Recovery" clicked');
			notifyInfo(widgetId, {trigger:"click", link:"passwordRecovery"});
			showWidget(oiiWidgets.WIDGET_PASSWORD_RECOVERY);
		}
	}

	function onTermsOfServiceClick(widgetId) {
		if( !oiiWidgets.isLoadingWidget ) {
			log('"Terms of Service" clicked');
			notifyInfo(widgetId, {trigger:"click", link:"termsOfService"});
			WIDGET_PARAMS.onTermsOfServiceClick();
		}
	}

	function onCustomerServiceClick(widgetId) {
		if( !oiiWidgets.isLoadingWidget ) {
			log('"Customer Service" clicked');
			notifyInfo(widgetId, {trigger:"click", link:"customerService"});
			WIDGET_PARAMS.onCustomerServiceClick();
		}
	}

	function onCreateAccountClick(widgetId) {
		if( !oiiWidgets.isLoadingWidget ) {
			log('"Create Account" clicked');
			notifyInfo(widgetId, {trigger:"click", link:"createAccount"});
			WIDGET_PARAMS.onCreateAccountClick();
		}
	}

	//----- Sign In Widget -----

	// Display function for Sign In widget.
	function showSignIn(widgetId) {
		log('Showing "Sign In" widget');

		oiiWidgets.hasSigninError = false;
		oiiWidgets.isLoadingWidget = true;

		var signInSubHeader = WIDGET_PARAMS.signInSubHeader;
		if( oiiWidgets.previousWidgetId === oiiWidgets.WIDGET_USERNAME_RECOVERY ) {
			if( WIDGET_PARAMS.signInSubHeaderUsernameRecovery ) {
				signInSubHeader = WIDGET_PARAMS.signInSubHeaderUsernameRecovery;
			}
		} else if( oiiWidgets.previousWidgetId === oiiWidgets.WIDGET_PASSWORD_RECOVERY ) {
			if( WIDGET_PARAMS.signInSubHeaderPasswordRecovery ) {
				signInSubHeader = WIDGET_PARAMS.signInSubHeaderPasswordRecovery;
			}
		}

		intuit.ius.signIn.setup({
			offeringId : WIDGET_PARAMS.offeringId,
			offeringEnv : WIDGET_PARAMS.oiiEnv,
			signUpUrl : onSignUpLinkClick,
			userIdRecoveryUrl : function(){onUserIdRecoveryClick(widgetId);},
			passwordRecoveryUrl : function(){onPasswordRecoveryClick(widgetId);},
			//signInHelpUrl : 'javascript:notYetImplemented()',
			onSignInSuccess : onSignInSuccess,
			onSignInFail : onSignInFail,
			onVerifySuccess : onSignInVerifySuccess,
			onTransferSuccess : onSignInTransferSuccess,
			onTransferFail : onSignInTransferFail,
			signInWithAnotherAccount : onSignInWithAnotherAccount,
			signUpAnotherAccount : onSignUpAnotherAccount,
			continueWithThisAccount : onContinueWithThisAccount,
			onSetRealmSuccess : onSignInSetRealmSuccess,
			onSetRealmFail: onSignInSetRealmFail,
			rememberMeExpires : 365,
            cachePassword : false,
			persistCookie : true,
			//signInBtnText : 'Sign In',
			//signInBtnTextClicked : 'Signing In...',
			enableFacebook : false,
			enableVerifyLogin : (WIDGET_PARAMS.showVerifyLogin && oiiWidgets.enableVerifyLogin),
			onLoad : function(){onSignInLoad(widgetId);},
			headerText : WIDGET_PARAMS.signInHeader,
			subHeaderText : signInSubHeader,
			userIdLabelText : WIDGET_PARAMS.signInUserIdLabel,
			passwordLabelText : WIDGET_PARAMS.signInPasswordLabel
		});
	}

	function onSignInLoad(widgetId) {
		oiiWidgets.isLoadingWidget = false;

		// Hide "create new account" link if requested to do so.
		if( !WIDGET_PARAMS.allowAccountCreate ) {
			var signUpLink = oiiWidgets.getChildElementById("ius-sign-in", "ius-sign-up", "li");
			if( signUpLink && signUpLink.style ) {
				signUpLink.style.display = "none";
			}
			signUpLink = oiiWidgets.getChildElementById("ius-verify-ticket", "sign-up", "li");
			if( signUpLink && signUpLink.style ) {
				signUpLink.style.display = "none";
			}
		}

		var userNameField = document.getElementById("ius-sign-in-username");
		var passwordField = document.getElementById("ius-sign-in-password");

		var userId = "";
		var userIdFrom = "";
		if( userNameField ) {
			// If user name was copied from a previous widget, use it to pre-fill.
			if( oiiWidgets.userNamePrefill != null ) {
				userNameField.value = oiiWidgets.userNamePrefill;
				userIdFrom = "userEntered";
				if( oiiWidgets.accountListCount !== null ) {
					userIdFrom = "accountList";
				} else if( !oiiWidgets.previousWidgetId || oiiWidgets.previousWidgetId === oiiWidgets.WIDGET_ACCOUNT_PICKER ) {
					userIdFrom = "accountPicker";
				}
			}
			// If a GLOGIN cookie is set, use it's value to pre-fill user name.
			else if( GLOGIN_COOKIE_VALUE ) {
				userNameField.value = GLOGIN_COOKIE_VALUE;
				userIdFrom = "glogin";
			}
			// If pre-fill value was given to widget, pre-fill with that.
			else if( WIDGET_PARAMS.userId ) {
				userNameField.value = WIDGET_PARAMS.userId;
				userIdFrom = "widgetParam";
			}
			userId = userNameField.value;
		}

		// If username field is empty, set focus to it; otherwise, if username is pre-filled, set focus to password.
		if (userNameField && userNameField.value.length === 0) {
			userNameField.focus();
			userNameField.value = userNameField.value;  // Hack to move caret to end of value.
		} else if (passwordField) {
			if (userNameField) {
				if (!userNameField.className) {
					userNameField.className = "valid";
				} else {
					// Only add "valid" if it's not already there.
					var classNames = " " + userNameField.className + " ";
					if (classNames.indexOf(" valid ") == -1) {
						classNames += "valid ";
						userNameField.className += classNames.trim();
					}
				}
			}
			passwordField.focus();
			passwordField.value = passwordField.value;  // Hack to move caret to end of value.
		}

		// Set handlers to clear any existing sign-in error message.
		if( userNameField ) {
			userNameField.onkeydown = clearSigninError;
		}
		if( passwordField ) {
			passwordField.onkeydown = clearSigninError;
		}

		// If we haven't yet updated the header text elements, do so now.
		// Get the main DIV where we want to modify and insert text.
		var signInElement = document.getElementById("ius-sign-in");
		// Makes sure the updates don't yet exist.
		if( signInElement && document.getElementById("h1Standard") === null ) {
			log( '"Sign In widget" - set up alternate header' );
			// Get the original H1 and H2 elements for the standard header and sub-header.
			var h1Items = signInElement.getElementsByTagName("h1");
			var h2Items = signInElement.getElementsByTagName("h2");
			var h1Standard = (h1Items && h1Items.length && h1Items.length > 0) ? h1Items[0] : null;
			var h2Standard = (h2Items && h2Items.length && h2Items.length > 0) ? h2Items[0] : null;
			// Create new element for the alternate text.
			var hAlt = document.createElement("h2");
			if( h1Standard && h2Standard && hAlt ) {
				// Assign IDs to the existing and newly created elements so that we can hide and show them as needed.
				h1Standard.id = "h1Standard";
				h2Standard.id = "h2Standard";
				hAlt.id = "alternateSignInHeader";
				hAlt.className = "alternateSignInHeader";
				// Initially make alternate element hidden.
				hAlt.style.display = "none";
				// Insert the newly created alternate element.
				h1Standard.parentNode.insertBefore(hAlt, h1Standard);
			}
		}

		// Get the header elements so that we can hide/show them as determined below.
		var alternateTextSet = false;
		var h1 = document.getElementById("h1Standard");
		var h2 = document.getElementById("h2Standard");
		var hAlt = document.getElementById("alternateSignInHeader");
		// If items are in place for alternate text handling, set header text as needed.
		if( h1 && h2 && hAlt ) {
			// Keep track of whether alternate text was generated.
			var alternateText = null;
			var isFromAccountPicker = (oiiWidgets.currentWidgetId === oiiWidgets.WIDGET_ACCOUNT_PICKER)
										|| (oiiWidgets.currentWidgetId === oiiWidgets.WIDGET_ACCOUNT_PICKER_EMAIL);
			// If we're coming from account-picker widget and an account was selected, modify header text.
			if( isFromAccountPicker && oiiWidgets.isAccountFound === true ) {
				var emailAddress = oiiWidgets.userEnteredEmail || WIDGET_PARAMS.unencryptedEmail;
				// If account-picker was shown with list of accounts and a user name is set, then user selected an account from the list.
				if( oiiWidgets.accountListCount && oiiWidgets.userNamePrefill !== null && typeof WIDGET_PARAMS.signInHeaderAccountUserSelected === 'string' ) {
					alternateText = WIDGET_PARAMS.signInHeaderAccountUserSelected;
					alternateText = alternateText.replace( "{1}", oiiWidgets.userNamePrefill );
					if( alternateText.indexOf("{0}") >= 0 ) {
						if( typeof emailAddress === 'string' && emailAddress.length > 0 ) {
							alternateText = alternateText.replace( "{0}",emailAddress  );
						} else {
							alternateText = null;
							log( '"Sign In" widget - not using alternate header "signInHeaderAccountUserSelected" because it contains a parameter for email address, but email address is not available' );
						}
					}
				}
				// If account-picker did not show list and a selected user name is set, then it was auto-selected.
				else if( !oiiWidgets.accountListCount && oiiWidgets.userNamePrefill !== null && typeof WIDGET_PARAMS.signInHeaderAccountAutoSelected === 'string' ) {
					alternateText = WIDGET_PARAMS.signInHeaderAccountAutoSelected;
					alternateText = alternateText.replace( "{1}", oiiWidgets.userNamePrefill );
					if( alternateText.indexOf("{0}") >= 0 ) {
						if( typeof emailAddress === 'string' && emailAddress.length > 0 ) {
							alternateText = alternateText.replace( "{0}",emailAddress  );
						} else {
							alternateText = null;
							log( '"Sign In" widget - not using alternate header "signInHeaderAccountAutoSelected" because it contains a parameter for email address, but email address is not available' );
						}
					}
				}
				// If account-picker did not show list and a selected user name is not set, then it was auto-selected,
				// but the user name didn't match the email address, so we can't show the user name to the user.
				else if( !oiiWidgets.accountListCount && oiiWidgets.userNamePrefill === null && typeof WIDGET_PARAMS.signInHeaderAccountNotShown === 'string' ) {
					alternateText = WIDGET_PARAMS.signInHeaderAccountNotShown;
					if( alternateText.indexOf("{1}") >= 0 ) {
						alternateText = null;
						log( '"Sign In" widget - not using alternate header "signInHeaderAccountNotShown" because it contains a parameter for userId, but userId is not available' );
					} else if( alternateText.indexOf("{0}") >= 0 ) {
						if( typeof emailAddress === 'string' && emailAddress.length > 0 ) {
							alternateText = alternateText.replace( "{0}",emailAddress  );
						} else {
							alternateText = null;
							log( '"Sign In" widget - not using alternate header "signInHeaderAccountNotShown" because it contains a parameter for email address, but email address is not available' );
						}
					}
				}
			}
			// If alternate text generated, show alternate header with the text.
			if( alternateText != null ) {
				log( '"Sign In" widget - showing alternate header' );
				if( h1 ) h1.style.display = "none";
				if( h2 ) h2.style.display = "none";
				hAlt.innerHTML = alternateText;
				if( hAlt ) hAlt.style.display = "block";
			}
			// Otherwise, show standard header.
			else {
				log( '"Sign In" widget - showing standard header' );
				if( h1 ) h1.style.display = "block";
				if( h2 ) h2.style.display = "block";
				if( hAlt ) hAlt.style.display = "none";
			}
		}

		// If we're showing the "verify login" version of the sign-in widget,
		// change the widget ID to reflect that.
		var info = null;
		if( isVisible("ius-verify-ticket") ) {
			widgetId = oiiWidgets.WIDGET_SIGN_IN_VERIFY;
			var userNameElement = document.getElementById("username");
			if( userNameElement && userNameElement.innerText ) {
				userId = userNameElement.innerText;
				info = {userId:userId};
			}
		} else {
			info = {userId:userId, userIdFrom:userIdFrom};
		}

		handleWidgetLoad(widgetId, info);
	}

	function onSignUpLinkClick() {
		if(	!oiiWidgets.isLoadingWidget ) {
			var userNameField = document.getElementById("ius-sign-in-username");
			if( userNameField ) {
				oiiWidgets.userNamePrefill = userNameField.value; // Save user-entered userId to pre-fill on next widget.
			}

			if( WIDGET_FUNCTIONS.onCreateAccountClick ) {
				WIDGET_FUNCTIONS.onCreateAccountClick(oiiWidgets.WIDGET_SIGN_UP);
			} else {
				notifyInfo(oiiWidgets.WIDGET_SIGN_IN, {trigger:"click", link:"signUp"});
				showWidget(oiiWidgets.WIDGET_SIGN_UP);
			}
		}
	}

	function onSignInSuccess(result) {
		var passwordField = document.getElementById("ius-sign-in-password");
		if( passwordField && passwordField.value ) {
			oiiWidgets.passwordPrefill = passwordField.value;
		}

		log('"Sign In" Success');

		if( result ) {
			oiiWidgets.cookies["agentId"] = result["agentId"];
			oiiWidgets.cookies["namespaceId"] = result["namespaceId"];
			oiiWidgets.cookies["realmId"] = result["realmId"];
			oiiWidgets.cookies["ticket"] = result["ticket"];
			oiiWidgets.cookies["userId"] = result["userId"];
		}

		var userId = "";
		var userNameField = document.getElementById("ius-sign-in-username");
		if( userNameField && userNameField.value ) {
			userId = userNameField.value;
		}
		notifyInfo(oiiWidgets.WIDGET_SIGN_IN, {trigger:"signIn", result:"success", userId:userId});

		showWidget(oiiWidgets.WIDGET_SECURITY_LEVEL);
	}

	function onSignInFail(response) {
		log('"Sign In" failed');
		oiiWidgets.hasSigninError = true;

		var userId = "";
		var userNameField = document.getElementById("ius-sign-in-username");
		if( userNameField && userNameField.value ) {
			userId = userNameField.value;
		}
		var info = {trigger:"signIn", result:"fail", userId:userId};
		addResponseProperties(info, response);
		notifyInfo(oiiWidgets.WIDGET_SIGN_IN, info);

		var passwordField = document.getElementById("ius-sign-in-password");
		if( passwordField ) {
			passwordField.focus();
			passwordField.value = passwordField.value; // Hack to move caret to end of value.
		}
	}

	function clearSigninError() {
		if( oiiWidgets.hasSigninError ) {
			oiiWidgets.hasSigninError = false;
			var errorLabel = oiiWidgets.getChildElementById("ius-sign-in", "error-message");
			if( errorLabel && errorLabel.innerText ) {
				errorLabel.innerText = "";
				errorLabel.className += " hide";
			}
		}
	}

	function onSignInWithAnotherAccount () {
		log("sign in with another account");
		oiiWidgets.userNamePrefill = null; // Clear any pre-existing email/userId that was saved for pre-fill.
		GLOGIN_COOKIE_VALUE = null; // Clear any pre-existing glogin cookie value.
		WIDGET_PARAMS.userId = null;// Clear any passed-in value for pre-fill.
		oiiWidgets.enableVerifyLogin = false;
		notifyInfo(oiiWidgets.WIDGET_SIGN_IN_VERIFY, {trigger:"click", link:"signIn"});
		showWidget(oiiWidgets.WIDGET_SIGN_IN);
	}

	function onSignUpAnotherAccount() {
		log("sign up another account");
		oiiWidgets.userNamePrefill = null;	// Clear any pre-existing email/userId that was saved for pre-fill.
		GLOGIN_COOKIE_VALUE = null; // Clear any pre-existing glogin cookie value.
		WIDGET_PARAMS.userId = null;// Clear any passed-in value for pre-fill.
		notifyInfo(oiiWidgets.WIDGET_SIGN_IN_VERIFY, {trigger:"click", link:"signUp"});

		if( WIDGET_FUNCTIONS.onCreateAccountClick ) {
			WIDGET_FUNCTIONS.onCreateAccountClick(oiiWidgets.WIDGET_SIGN_UP);
		} else {
			notifyInfo(oiiWidgets.WIDGET_SIGN_IN, {trigger:"click", link:"signUp"});
			showWidget(oiiWidgets.WIDGET_SIGN_UP);
		}
	}

	function onContinueWithThisAccount() {
		log("continue with this account");
		notifyInfo(oiiWidgets.WIDGET_SIGN_IN_VERIFY, {trigger:"click", link:"continue"});
		showWidget(oiiWidgets.WIDGET_SECURITY_LEVEL);
	}

	function onSignInSetRealmSuccess(response) {
		log('"SignIn" set realm success');
		notifyInfo(oiiWidgets.WIDGET_SIGN_IN, {trigger:"setRealm", result:"success"});
	}

	function onSignInSetRealmFail(errorMessage) {
		log('"SignIn" set realm failed');
		var info = {trigger:"setRealm", result:"fail"};
		addResponseProperties(info, errorMessage);
		notifyInfo(oiiWidgets.WIDGET_SIGN_IN, info);
	}

	function onSignInVerifySuccess() {
		log('"Sign In" verify success');
		notifyInfo(oiiWidgets.WIDGET_SIGN_IN, {trigger:"signInVerify", result:"success"});
	}

	function onSignInTransferSuccess() {
		log('"Sign In" transfer success');
		notifyInfo(oiiWidgets.WIDGET_SIGN_IN, {trigger:"signInTransfer", result:"success"});
	}

	function onSignInTransferFail(response) {
		log('"Sign In" transfer failed');
		var info = {trigger:"signInTransfer", result:"fail"};
		addResponseProperties(info, response);
		notifyInfo(oiiWidgets.WIDGET_SIGN_IN, info);
	}

	//----- Sign Up widget -----

	// Display function for Sign Up widget.
	function showSignUp(widgetId) {
		log('Showing "Sign Up" widget');

		oiiWidgets.isLoadingWidget = true;

		intuit.ius.signUp.setup({
			offeringId : WIDGET_PARAMS.offeringId,
			offeringEnv : WIDGET_PARAMS.oiiEnv,
			signInUrl : onSignInLinkClick,
			userIdRecoveryUrl : function(){onUserIdRecoveryClick(widgetId);},
			passwordRecoveryUrl : function(){onPasswordRecoveryClick(widgetId);},
			showMobilePhone : true,
			showName : false,
			isNameRequired : false,
			rememberMeExpires : 365,
            cachePassword : false,
			onSignUpSuccess : onSignUpSuccess,
			onSignUpFail: onSignUpFail,
			onSetRealmSuccess : onSignUpSetRealmSuccess,
			onSetRealmFail: onSignUpSetRealmFail,
			persistCookie : true,
			//signUpBtnText : 'Sign Up',
			//signUpBtnTextClicked : 'Signing Up...',
			enableFacebook : false,
			onLoad : function(){onSignUpLoad(widgetId);},
			headerText : WIDGET_PARAMS.signUpHeader,
			subHeaderText : WIDGET_PARAMS.signUpSubHeader
		});
	}

	function onSignUpLoad(widgetId) {
		oiiWidgets.isLoadingWidget = false;
		var userNameField = document.getElementById("ius-email");

		if( userNameField ) {
			userNameField.value = "";
			userNameField.focus();
			// If a user name was copied for pre-fill from previous widget, pre-fill with that.
			if( oiiWidgets.userNamePrefill != null ) {
				userNameField.value = oiiWidgets.userNamePrefill;
			}
			// If a user name was passed in to widget for pre-filling, use that.
			else if( WIDGET_PARAMS.userId ) {
				userNameField.value = WIDGET_PARAMS.userId;
			}
		}

		// If client wants to handle URL navigation for "terms of service" link, change anchor tag in widget to send URL navigation to client.
		setLinkToCallback(widgetId, "ius-sign-up-terms-of-use", WIDGET_FUNCTIONS.onTermsOfServiceClick);

		handleWidgetLoad(widgetId);
	}

	function onSignInLinkClick(userName) {
		log('"SignIn" clicked');

		if( !oiiWidgets.isLoadingWidget ) {
			// If user name not passed in, see if we can get it from text field.
			if( typeof userName === 'undefined' || !userName ) {
				var userNameField = document.getElementById("ius-email");
				if( userNameField ) {
					userName = userNameField.value;
				}
			}
			oiiWidgets.userNamePrefill = userName; // Save user-entered email to pre-fill as userId on next widget.
			notifyInfo(oiiWidgets.WIDGET_SIGN_UP, {trigger:"click", link:"signIn"});
			showWidget(oiiWidgets.WIDGET_SIGN_IN );
		}
	}

	function onSignUpSuccess(result) {
		var passwordField = document.getElementById("ius-sign-up-password");
		if( passwordField && passwordField.value ) {
			oiiWidgets.passwordPrefill = passwordField.value;
		}

		log('"Sign Up" Success');

		var userId = "";
		var userNameField = document.getElementById("ius-email");
		if( userNameField && userNameField.value ) {
			userId = userNameField.value;
		}
        if( passwordField && passwordField.value ) {
            signInAndUpdateOiiWidgetsCookies(result, passwordField.value);
        }
		notifyInfo(oiiWidgets.WIDGET_SIGN_UP, {trigger:"signUp", userId:userId, result:"success"});

		showWidget(oiiWidgets.WIDGET_SECURITY_LEVEL);
	}

    function signInAndUpdateOiiWidgetsCookies(result, password) {
        intuit.ius.apis.createSecurityToken({
            username: result.username,
            password: password,
            namespaceId: result.namespaceId,
            offeringId: WIDGET_PARAMS.offeringId,
            offeringEnv: WIDGET_PARAMS.oiiEnv,
            persistCookie: true,
            done: function(result) {
                oiiWidgets.cookies["agentId"] = result["agentId"];
                oiiWidgets.cookies["namespaceId"] = result["namespaceId"];
                oiiWidgets.cookies["realmId"] = result["realmId"];
                oiiWidgets.cookies["ticket"] = result["ticket"];
                oiiWidgets.cookies["userId"] = result["userId"];
            },
            fail: function(response) { }
        });
    }

	function onSignUpFail(response) {
		log('"Sign Up" failed');

		var userId = "";
		var userNameField = document.getElementById("ius-email");
		if( userNameField && userNameField.value ) {
			userId = userNameField.value;
		}
		var info = {trigger:"signUp", userId:userId, result:"fail"};
		addResponseProperties(info, response);
		notifyInfo(oiiWidgets.WIDGET_SIGN_UP, info);
	}

	function onSignUpSetRealmSuccess(response) {
		log('"SignUp" set realm success');
		notifyInfo(oiiWidgets.WIDGET_SIGN_UP, {trigger:"setRealm", result:"success"});
	}

	function onSignUpSetRealmFail(response) {
		log('"SignUp" set realm failed');
		var info = {trigger:"setRealm", result:"fail"};
		addResponseProperties(info, response);
		notifyInfo(oiiWidgets.WIDGET_SIGN_UP, info);
	}

	//----- Security Level Manager widget -----

	// Display function for Security Level Manager widget.
	function showSecurityLevelManager(widgetId) {
		log('Showing "Security Level Manager" widget');

		oiiWidgets.isLoadingWidget = true;

		intuit.ius.securityLevelManager.setup({
			offeringId : WIDGET_PARAMS.offeringId,
			offeringEnv : WIDGET_PARAMS.oiiEnv,
			password : oiiWidgets.passwordPrefill,
			onUserAlreadyHighSecurityLevel : function(){onUserAlreadyHighSecurityLevel(widgetId);},
			onUpdateSecurityLevelSuccess : function(){onUpdateSecurityLevelSuccess(widgetId);},
			onUpdateSecurityLevelFail : function(){onUpdateSecurityLevelFail(widgetId);},
			onLoad : function(){onSecurityLevelManagerLoad(widgetId);},
			headerText : WIDGET_PARAMS.securityLevelManagerHeader,
			subHeaderText : WIDGET_PARAMS.securityLevelManagerSubHeader
		});
	}

	function onSecurityLevelManagerLoad(widgetId) {
		oiiWidgets.isLoadingWidget = false;

		var showPasswordField = false;
		var passwordField = document.getElementById("reauth-password");
		var answerField = document.getElementById("ius-security-answer");
		// Password field might be hidden, so set focus only if it's visible.
		if( passwordField && passwordField.offsetHeight ) {
			showPasswordField = true;
			passwordField.focus();
		}
		// If password field not visible, set focus to security answer field.
		else if( answerField && answerField.offsetHeight) {
			answerField.focus();
		}

		// onLoad gets called even if widget isn't actually displayed. So check if we're actually showing the widget.
		if( isVisible(widgetId) ) {
			notifyInfo(widgetId, {trigger:"checkSecurityLevel", result:"low"});
			handleWidgetLoad(widgetId, {showPasswordField:showPasswordField});
		}
	}

	function onUserAlreadyHighSecurityLevel(widgetId) {
		log('"Security Level" no update required - security level skipped');
		notifyInfo(widgetId, {trigger:"checkSecurityLevel", result:"high"});
		showWidget(oiiWidgets.WIDGET_REALM_PICKER);
	}

	function onUpdateSecurityLevelSuccess(widgetId) {
		log('"Security Level" update success');
		notifyInfo(widgetId, {trigger:"updateSecurityLevel", result:"success"});
		showWidget(oiiWidgets.WIDGET_REALM_PICKER);
	}

	function onUpdateSecurityLevelFail(widgetId) {
		log('"Security Level" update failed');
		notifyInfo(widgetId, {trigger:"updateSecurityLevel", result:"fail"});
		//showWidget(oiiWidgets.WIDGET_REALM_PICKER);
	}

	//----- Realm Picker widget ----

	// Display function for Realm Picker widget.
	function showRealmPicker(widgetId){
		log('Showing "Realm Picker" widget');
		oiiWidgets.isLoadingWidget = true;
		oiiWidgets.realmListCount = null;

		var onCreateNewCompanySelected = null;
		if( WIDGET_PARAMS.onFinishNeedCreate ) {
			onCreateNewCompanySelected = function(companyName) {onRealmPickerCreateNewCompany(widgetId,companyName);};
		}

		REALM_PICKER_START_TIME = new Date();

		intuit.ius.realmPicker.setup({
			offeringId : WIDGET_PARAMS.offeringId,
			offeringEnv : WIDGET_PARAMS.oiiEnv,
			flow : WIDGET_PARAMS.flow,
			autoCreateCompany : true,	// TODO: Might be obsolete and can be deleted.
			isProductSignUp : !WIDGET_PARAMS.isSignin,
			encryptedData : WIDGET_PARAMS.encryptedData,
			companyNameToBeCreated : WIDGET_PARAMS.companyName,
			realmNamePattern : WIDGET_PARAMS.companyName,
			onSetRealm : function(realmId,grantInfo,autoCreated) {onRealmPickerSuccess(widgetId,realmId,grantInfo,autoCreated);},
			onFindRealmFail : function(realmId, errorMessage) {onRealmPickerFail(widgetId,errorMessage);},
			onError : function(errorInfo) {onRealmPickerError(widgetId,errorInfo);},
			onSignOutBtnClicked : function() {onRealmPickerSignOut(widgetId);},
			onCreateNewCompanySelected : onCreateNewCompanySelected,
			onLoad : function(){onRealmPickerLoad(widgetId);},
			selectRealmHeader : WIDGET_PARAMS.selectRealmHeader,
			selectRealmSubHeader : WIDGET_PARAMS.selectRealmSubHeader,
			createRealmHeader : WIDGET_PARAMS.createRealmHeader,
			createRealmSubHeader : WIDGET_PARAMS.createRealmSubHeader
		});
	}

	function onRealmPickerLoad(widgetId) {
		oiiWidgets.isLoadingWidget = false;

		var isWidgetVisible = isVisible(widgetId);
		var loadTime = getElapsedTime(REALM_PICKER_START_TIME);

		// If realm picker is shown, send notification of how many realms are found.
		if( isVisible("select-realm") || isVisible("ius-realm-picker") ) {
			// Hide "create new company" link if requested to do so.
			if( !WIDGET_PARAMS.allowRealmCreate ) {
				var selectRealm = document.getElementById("select-realm");
				if( selectRealm ) {
					var footer = selectRealm.getElementsByTagName("tfoot");
					if( footer && footer.length ) {
						footer = footer[0];
					}
					if( footer && footer.style ) {
						footer.style.display = "none";
					}
				}
			}
			var count = getListCount( document.getElementById(widgetId) );
			oiiWidgets.realmListCount = count;
			handleWidgetLoad(oiiWidgets.WIDGET_REALM_PICKER, {listCount:oiiWidgets.realmListCount, loadTime:loadTime});
		}
		else if( isVisible("create-realm") ) {
			handleWidgetLoad(oiiWidgets.WIDGET_REALM_PICKER_CREATE, {loadTime:loadTime});
			// If caller defines a handler for realm create, call it.
			if( WIDGET_PARAMS.onFinishNeedCreate ) {
				// Since client is handling creation, hide widget "create realm" view.
				var createRealm = document.getElementById("create-realm");
				if( createRealm && createRealm.style ) {
					createRealm.style.display = "none";
					showLoaderAnimation();
				}
				onRealmPickerCreateNewCompany(oiiWidgets.WIDGET_REALM_PICKER_CREATE);
			}
		}
		else if( isVisible("sign-out") ) {
			handleWidgetLoad(oiiWidgets.WIDGET_REALM_PICKER_SIGNOUT, {loadTime:loadTime});
		}

		// If widget content not displayed, keep loader animation running.
		if( !isWidgetVisible ) {
			showLoaderAnimation();
		} else {
			REALM_PICKER_START_TIME = null;  // Clear the start time so that we don't try to calculate a realm auto-select time.
		}
	}

	function onRealmPickerSuccess(widgetId, realmId, grantInfo, autoCreated) {
		log('"Realm Picker" success (realmId=' + realmId + ')');
		var listShown = (oiiWidgets.realmListCount !== null);
		if( typeof grantInfo === 'undefined' ) grantInfo = null;
		if( typeof autoCreated === 'undefined' ) autoCreated = false;
		var info = {trigger:"selectRealm", result:"success", realmId:realmId, listShown:listShown, listCount:oiiWidgets.realmListCount, grantInfo:grantInfo, autoCreated:autoCreated};
		if( !listShown && REALM_PICKER_START_TIME != null ) {
			var loadTime = getElapsedTime(REALM_PICKER_START_TIME);
			info["autoSelectTime"] = loadTime;
		}
		notifyInfo(widgetId, info);

		var userData;
		intuit.ius.apis.getUserData({
			offeringId : WIDGET_PARAMS.offeringId,
			offeringEnv : WIDGET_PARAMS.oiiEnv,
			done : function(response) { userData = response; }
			// on fail just leave userData undefined.
		});
		notifyFinish(widgetId, realmId, grantInfo, autoCreated, userData);
	}

	function onRealmPickerFail(widgetId, errorMessage) {
		log('"Realm Picker" fail');
		var listShown = (oiiWidgets.realmListCount !== null);
		var info = {trigger:"selectRealm", result:"fail", realmId:"", listShown:listShown};
		addResponseProperties(info, errorMessage);
		if( !listShown && REALM_PICKER_START_TIME != null ) {
			var loadTime = getElapsedTime(REALM_PICKER_START_TIME);
			info["autoSelectTime"] = loadTime;
		}
		notifyInfo(widgetId, info);
	}

	function onRealmPickerError(widgetId, errorInfo) {
		log('"Realm Picker" error');
		var listShown = (oiiWidgets.realmListCount !== null);
		notifyInfo(widgetId, {trigger:"selectRealm", result:"error", realmId:"", listShown:listShown});
		notifyError(widgetId, oiiWidgets.errorCodes.UNKNOWN, errorInfo || "realm picker error");
	}

	function onRealmPickerSignOut(widgetId) {
		log('"Realm Picker" sign out');
		oiiWidgets.userNamePrefill = null;	// Clear any pre-existing email/userId that was saved for pre-fill.
		GLOGIN_COOKIE_VALUE = null; // Clear any pre-existing glogin cookie value.
		WIDGET_PARAMS.userId = null;// Clear any passed-in value for pre-fill.
		notifyInfo(widgetId, {trigger:"click", link:"signOut"});
		showWidget(oiiWidgets.WIDGET_SIGN_IN);
	}

	function onRealmPickerCreateNewCompany(widgetId, companyName) {
		log('"Realm Picker" create new company');
		REALM_PICKER_START_TIME = null;  // Clear the start time so that we don't try to calculate a realm auto-select time.
		if( WIDGET_PARAMS.onFinishNeedCreate ) {
			if( typeof companyName === "undefined" ) {
				companyName = null;
			}
			var userData;
			intuit.ius.apis.getUserData({
				offeringId : WIDGET_PARAMS.offeringId,
				offeringEnv : WIDGET_PARAMS.oiiEnv,
				done : function(response) { userData = response; }
				// on fail just leave userData undefined.
			});
			WIDGET_PARAMS.onFinishNeedCreate(companyName, userData);
		}
	}

	//----- Account Picker widget -----

	// Display function for Account Picker widget.
	function showAccountPicker(widgetId){
		log('Showing "Account Picker" widget');

		oiiWidgets.isLoadingWidget = true;
		oiiWidgets.isAccountFound = false;
		oiiWidgets.accountListCount = null;
		oiiWidgets.userEnteredEmail = null;
		oiiWidgets.userNamePrefill = null;

		ACCOUNT_PICKER_START_TIME = new Date();

		intuit.ius.accountPicker.setup({
			offeringId : WIDGET_PARAMS.offeringId,
			offeringEnv : WIDGET_PARAMS.oiiEnv,
			encryptedEmail : WIDGET_PARAMS.encryptedEmail,
			signInWithDifferentId : onSignInWithDifferentId,
			onAccountFound : function(userId) {onAccountFound(widgetId,userId);},
			onAccountNotFound : function() {onAccountNotFound(widgetId);},
			onFindAccountError : function(){onFindAccountError(widgetId);},
			onLoad : function(){onAccountPickerLoad(widgetId);},
			emailCheckerHeader : WIDGET_PARAMS.emailCheckerHeader,
			emailCheckerSubHeader : WIDGET_PARAMS.emailCheckerSubHeader,
			selectAccountHeader : WIDGET_PARAMS.selectAccountHeader,
			selectAccountSubHeader : WIDGET_PARAMS.selectAccountSubHeader
		});
	}

	function onAccountPickerLoad(widgetId) {
		log('"Account Picker" load');
		oiiWidgets.isLoadingWidget = false;
		// Determine which view of account picker is shown and handle accordingly.
		if( isVisible("email-checker") ) {
			onAccountPickerLoadEmailView(oiiWidgets.WIDGET_ACCOUNT_PICKER_EMAIL);
		} else {
			onAccountPickerLoadListView(oiiWidgets.WIDGET_ACCOUNT_PICKER);
		}
	}

	function onAccountPickerLoadEmailView(widgetId) {
		log('"Account Picker" showing email view');

		// If "enter email" view gets displayed, it interferes with load time calculation for the account list.
		// So clear the start time so that we don't show an incorrect load time.
		ACCOUNT_PICKER_START_TIME = null;

		// Find email field.
		var emailField = oiiWidgets.getChildElementById("email-checker", "emailAddress", "input");

		var emailFrom = "userEntered";
		if( emailField ) {
			emailField.value = "";
			emailField.focus();
			// If there's a GLOGIN cookie, use it to pre-fill email field.
			if( GLOGIN_COOKIE_VALUE ) {
				emailField.value = GLOGIN_COOKIE_VALUE;
				emailFrom = "glogin";
			}
			// Otherwise, if an email was provided, pre-fill with that.
			else if( WIDGET_PARAMS.unencryptedEmail ) {
				emailField.value = WIDGET_PARAMS.unencryptedEmail;
				emailfrom = "unencryptedEmail";
			}
			// Clear and restore focus to invoke validation and enable "Continue" button.
			if( emailField.value && emailField.value.length > 0 ) {
				emailField.blur();
				emailField.focus();
				emailField.value = emailField.value;	// Hack to move caret to end of field.
			}
		}

		var info = {};
		if( emailField && emailField.value ) {
			info["email"] = emailField.value;
		} else {
			info["email"] = null;
		}
		info["emailFrom"] = emailFrom;
		handleWidgetLoad(widgetId, info);
	}

	function onAccountPickerLoadListView(widgetId) {
		// If previous widget was account picker "enter email" view, remember the email address that the user entered.
		// We'll use this later downstream to pre-fill other email and userId fields.
		var emailField = document.getElementById("emailAddress");
		if( emailField && emailField.value && emailField.value.length > 0 ) {
			oiiWidgets.userEnteredEmail = emailField.value;
		}
		log('"Account Picker" showing list view (userEnteredEmail=' + oiiWidgets.userEnteredEmail + ')');

		// Get how many accounts are shown in list.
		if( isVisible(widgetId) ) {
			var count = getListCount( document.getElementById(widgetId) );
			oiiWidgets.accountListCount = count;
		}

		var loadTime = getElapsedTime(ACCOUNT_PICKER_START_TIME);
		ACCOUNT_PICKER_START_TIME = null;  // Clear the start time so that we don't try to calculate an account auto-select time.
		var info = {
			listCount:oiiWidgets.accountListCount,
			email:oiiWidgets.userEnteredEmail || WIDGET_PARAMS.unencryptedEmail,
			loadTime:loadTime
		};
		handleWidgetLoad(widgetId, info);
	}

	function onAccountFound(widgetId, selectedUserId) {
		var logText = '"Account Picker"';
		if( oiiWidgets.currentWidgetId === oiiWidgets.WIDGET_ACCOUNT_PICKER_EMAIL ) {
			logText += " email view";
		} else if( oiiWidgets.currentWidgetId === oiiWidgets.WIDGET_ACCOUNT_PICKER ) {
			logText += " list view";
		} else {
			// If account-picker is auto-picking an account, no account-picker view was displayed.
			// We need to set the current widget ID so the following widget knows we came from the account-picker.
			oiiWidgets.currentWidgetId = oiiWidgets.WIDGET_ACCOUNT_PICKER;
		}
		logText += " - account found (selected userId=" + (selectedUserId || "null") + ")";
		log(logText);

		oiiWidgets.isAccountFound = true;
		var listShown = (oiiWidgets.accountListCount !== null);

		// If previous widget was account picker "enter email" view, remember the email address that the user entered.
		// We'll use this later downstream to pre-fill other email and userId fields.
		var emailField = document.getElementById("emailAddress");
		if( emailField && emailField.value && emailField.value.length > 0 ) {
			oiiWidgets.userEnteredEmail = emailField.value;
		}
		var result = null;
		var nextWidget = null;
		var safeUserId = null;

		// Use cases for signup workflows.
		if( WIDGET_PARAMS.isSignup ) {
			// Selected user ID is provided only if conditions specified by back-end business rules are met.
			// For example, for CMT/IOP flow, user ID is provided only if a single QBO account was found and
			// the account's user name was the same as the email address.
			if( selectedUserId ) {
				oiiWidgets.userNamePrefill = selectedUserId; // Save the found user ID to pre-fill on next widget.
				nextWidget = oiiWidgets.WIDGET_SIGN_IN;
				result = "success";
				log( '"Account Picker" using ' + selectedUserId + ' for sign-in');
			}
			// If back-end business rules were not met, but a GLOGIN cookie exists, use that for sign-in pre-fill.
			else if( GLOGIN_COOKIE_VALUE ) {
				selectedUserId = GLOGIN_COOKIE_VALUE;
				nextWidget = oiiWidgets.WIDGET_SIGN_IN;
				result = "glogin";
				log( '"Account Picker" using GLOGIN (' + GLOGIN_COOKIE_VALUE + ') for sign-in');
			}
			// If no acceptable account was found, go to sign-in widget, but don't pre-fill user ID.
			else {
				nextWidget = oiiWidgets.WIDGET_SIGN_IN;
				result = "mismatch";
				log( '"Account Picker" using no account for sign-in');
			}
		}
		// Use cases for non-signup workflows.
		else {
			// User ID may be provided because only one matched the given encrypted email address, or because user picked one from list.
			if( selectedUserId ) {
				// If selected account was picked by user from account list, use it.
				if( listShown ) {
					oiiWidgets.userNamePrefill = selectedUserId; // Save the found user ID to pre-fill on next widget.
					nextWidget = oiiWidgets.WIDGET_SIGN_IN;
					result = "success";
					log( '"Account Picker" using selected ' + selectedUserId + ' for sign-in');
				}
				// If selected account was automatically picked by widget (because there was only one that matched),
				// use it only if email is confirmed or userId matches the confirmed email.
				else if( WIDGET_PARAMS.isEmailConfirmed || (WIDGET_PARAMS.unencryptedEmail && WIDGET_PARAMS.unencryptedEmail === selectedUserId) ) {
					oiiWidgets.userNamePrefill = selectedUserId; // Save the found user ID to pre-fill on next widget.
					nextWidget = oiiWidgets.WIDGET_SIGN_IN;
					result = "success";
					log( '"Account Picker" using auto-selected ' + selectedUserId + ' for sign-in');
				}
				// If we don't have a usable match, go to sign-in widget, but don't pre-fill value for user ID.
				else {
					nextWidget = oiiWidgets.WIDGET_SIGN_IN;
					result = "mismatch";
					log( '"Account Picker" using no account for sign-in');
				}
				// Initially, we were setting GLOGIN cookie to selected user ID. For now, we're no longer doing that.
				// intuit.ius.storage.setItem(GLOGIN_COOKIE_NAME, userId, COOKIE_EXPIRATION);
			}
			// If a matching account was not found but a GLOGIN cookie exists, use that for sign-in.
			else if( GLOGIN_COOKIE_VALUE ) {
				selectedUserId = GLOGIN_COOKIE_VALUE;
				nextWidget = oiiWidgets.WIDGET_SIGN_IN;
				result = "glogin";
				log( '"Account Picker" using GLOGIN (' + GLOGIN_COOKIE_VALUE + ') for sign-in');
			}
			// If no acceptable account was found, go to sign-up widget.
			else {
				nextWidget = oiiWidgets.WIDGET_SIGN_UP;
				result = "mismatch";
				log( '"Account Picker" directing to sign-up with no userId');
			}
		}

		var email = oiiWidgets.userEnteredEmail || WIDGET_PARAMS.unencryptedEmail;
		var info = {trigger:"selectAccount", result:result, listShown:listShown, listCount:oiiWidgets.accountListCount, email:email, selectedUserId:(selectedUserId || "null")};
		if( !listShown && ACCOUNT_PICKER_START_TIME != null ) {
			var loadTime = getElapsedTime(ACCOUNT_PICKER_START_TIME);
			info["autoSelectTime"] = loadTime;
		}
		notifyInfo( widgetId, info );

		if( nextWidget == null ) {
			notifyFinish(widgetId);	// Client will need to handle "finish" with no RealmId set.
		} else {
			showWidget(nextWidget);
		}
	}

	function onAccountNotFound(widgetId) {
		log('"Account Picker" account not found');
		var listShown = (oiiWidgets.accountListCount !== null);

		var emailField = document.getElementById("emailAddress");
		if( emailField ) {
			oiiWidgets.userEnteredEmail = emailField.value; // Save user-entered email to pre-fill on next widget.
		}

		var email = oiiWidgets.userEnteredEmail || WIDGET_PARAMS.unencryptedEmail;
		var info = {trigger:"selectAccount", result:"fail", listShown:listShown, email:email};
		if( !listShown && ACCOUNT_PICKER_START_TIME != null ) {
			var loadTime = getElapsedTime(ACCOUNT_PICKER_START_TIME);
			info["autoSelectTime"] = loadTime;
		}
		notifyInfo(widgetId, info);

		// For sign-up workflow, if we're unable to find an account for given email address, the widget workflow ends.
		// We indicate this condition to the client by calling onFinish without realm info.
		// Setting autoSignup=true will override this and take user to sign-up widget.
		if( !WIDGET_PARAMS.autoSignup ) {
			log( 'Returning to caller to handle create functionality (set autoSignup=true to go to sign-up widget)');
			notifyFinish(widgetId);	// Client will need to handle "finish" with no RealmId set.
		}
		// For other workflows, we go to sign-up, where email address will be pre-filled.
		else {
			oiiWidgets.userNamePrefill = oiiWidgets.userEnteredEmail || WIDGET_PARAMS.unencryptedEmail;
			showWidget(oiiWidgets.WIDGET_SIGN_UP);
		}
	}

	function onFindAccountError(widgetId) {
		log('*** "Account Picker" find account error');
		var listShown = (oiiWidgets.accountListCount !== null);
		var emailField = document.getElementById("emailAddress");
		if( emailField ) {
			oiiWidgets.userEnteredEmail = emailField.value; // Save user-entered email to pre-fill on next widget.
		}
		var email = oiiWidgets.userEnteredEmail || WIDGET_PARAMS.unencryptedEmail;
		notifyInfo(widgetId, {trigger:"selectAccount", result:"error", listShown:listShown, email:email});
		notifyError(widgetId, oiiWidgets.errorCodes.ACCOUNT_PICKER, "Account Picker error");
	}

	function onSignInWithDifferentId() {
		log('"Account Picker" clicked sign in with different id');
		notifyInfo(oiiWidgets.WIDGET_ACCOUNT_PICKER, {trigger:"click", link:"signIn"});
		oiiWidgets.accountListCount = null; // Clear saved account list info since we're starting over.
		oiiWidgets.userNamePrefill = null;	// Clear any pre-existing email/userId that was saved for pre-fill.
		GLOGIN_COOKIE_VALUE = null; // Clear any pre-existing glogin cookie value.
		WIDGET_PARAMS.userId = null;// Clear any passed-in value for pre-fill.
		showWidget(oiiWidgets.WIDGET_SIGN_IN);
	}

	//----- Username Recovery widget -----

	// Display function for Username Recovery widget.
	function showUsernameRecovery(widgetId) {
		log('Showing "Username Recovery" widget');

		oiiWidgets.isLoadingWidget = true;

		intuit.ius.usernameRecovery.setup({
			offeringId : WIDGET_PARAMS.offeringId,
			offeringEnv : WIDGET_PARAMS.oiiEnv,
			onRecoverSuccess : onUsernameRecoverySuccess,
			signInUrl : "javascript:oiiWidgets.showWidget('" + oiiWidgets.WIDGET_SIGN_IN + "');",
			customerServiceUrl : function(){}, // Empty function to do nothing - link handling controlled by setLinkToCallback() call in onUsernameRecoveryLoad() below.
			onLoad : function(){onUsernameRecoveryLoad(widgetId);}
		});
	}

	function onUsernameRecoveryLoad(widgetId) {
		oiiWidgets.isLoadingWidget = false;

		var emailField = document.getElementById("user-email");
		if( emailField ) {
			emailField.value = "";
			emailField.focus();
			// Pre-fill email with user-entered value from previous widget.
			if( oiiWidgets.userNamePrefill ) {
				emailField.value = oiiWidgets.userNamePrefill;
				emailField.className += " valid";
				// Clear and restore focus to invoke validation and enable "Continue" button.
				emailField.blur();
				emailField.focus();
				emailField.value = emailField.value;	// Hack to move caret to end of field.
			}
		}

		setLinkToCallback(widgetId, "widget-footer", WIDGET_FUNCTIONS.onCustomerServiceClick);

		handleWidgetLoad(widgetId);
	}

	function onUsernameRecoverySuccess() {
		handleWidgetLoad(oiiWidgets.WIDGET_USERNAME_RECOVERY_SUCCESS);
	}

	//----- Password Recovery widget -----

	// Display function for Password Recovery widget.
	function showPasswordRecovery(widgetId) {
		log('Showing "Password Recovery" widget');

		oiiWidgets.isLoadingWidget = true;

		var passwordRecoveryContinue = null;
		if( WIDGET_PARAMS.passwordRecoveryContinue ) {
			passwordRecoveryContinue = function(){WIDGET_PARAMS.passwordRecoveryContinue(widgetId);};
		}

		intuit.ius.passwordRecovery.setup({
			offeringId : WIDGET_PARAMS.offeringId,
			offeringEnv : WIDGET_PARAMS.oiiEnv,
			redirectUrl : WIDGET_PARAMS.passwordRecoveryFinishUrl,
			continueToSignIn : passwordRecoveryContinue,
			//showSignIn : true,
			//signInUrl : "javascript:onPasswordRecoverySignIn();",
			customerServiceUrl : function(){}, // Empty function to do nothing - link handling controlled by setLinkToCallback() call in onUsernameRecoveryLoad() below.
			onConfirmationSentSuccess : onPasswordRecoverySentSuccess,
			onLoad : function(){onPasswordRecoveryLoad(widgetId);}
		});
	}

	function onPasswordRecoveryLoad(widgetId) {
		oiiWidgets.isLoadingWidget = false;

		var emailField = document.getElementById("user-id");
		if( emailField ) {
			emailField.value = "";
			emailField.focus();
			// Pre-fill email with user-entered value from previous widget.
			if( oiiWidgets.userNamePrefill ) {
				emailField.value = oiiWidgets.userNamePrefill;
				emailField.className += " valid";
				// Clear and restore focus to invoke validation and enable "Continue" button.
				emailField.blur();
				emailField.focus();
				emailField.value = emailField.value;	// Hack to move caret to end of field.
			}
		}

		setLinkToCallback(widgetId, "widget-footer", WIDGET_FUNCTIONS.onCustomerServiceClick);

		handleWidgetLoad(widgetId);
	}

	function onPasswordRecoverySentSuccess() {
		handleWidgetLoad(oiiWidgets.WIDGET_PASSWORD_RECOVERY_SUCCESS);
	}

	function onPasswordRecoverySignIn() {
		log('"Password Recovery" clicked sign in');
		notifyInfo(oiiWidgets.WIDGET_PASSWORD_RECOVERY, {trigger:"click", link:"signIn"});
		showWidget(oiiWidgets.WIDGET_SIGN_IN);
	}

})(window,document);
