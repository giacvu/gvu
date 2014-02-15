/**
 * Define Intuit model behavior.
 * Extends Backbone / Nested models.
 *
 */
define(['underscore', 'backbone', 'deepExtend', 'backboneNested'],

function(_, Backbone, deepExtend, backboneNested) {

    if (typeof Intuit == "undefined" || !Intuit) {
        var Intuit = {};
    }

	// Private declarations

	// Config that get passed to the Backbone.sync method.
    var syncConfig = {};

    var applySyncOptions = function(options) {
        var outputOptions = options;
        if (!_.isEmpty(syncConfig)) {
            if (_.isUndefined(outputOptions)) {
                outputOptions = {};
            }
            _.deepExtend(outputOptions, syncConfig);
        }
        return outputOptions;
    }

	/*
	 * Config for Intuit model/collection. These are not passed to Backbone.
	 *
	 * Options/defaults
	 * errorCleanUp - a function that does any clean up needed when a fatal error is encountered
	 * 		default - no clean up
	 * errorPage - function or string, when a fatal error is encountered,
	 * 		if it is a string, it is assumed to be a url, the page is reloaded with the url,
	 * 		if it is a function, the function is called
	 * 		default - error.html
	 * waitTime - time to wait before putting up the wait page
	 * 		default - 500 milliseconds (1/2 second)
	 *
	 * Future enhancement, may consider letting individual calls pass in their own config.
	 */
	var ownSyncConfig = {
		errorPage: 'error.html',
		waitTime: 500
	};

	/**
	 * Hide waiting.
	 */
	var waitingHide = function(obj) {
		console.log('Intuit waitingHide(): ' + obj.waitTimer);

		// Clear the timer and set it to null. If the timer callback is already queue up,
		// can check for null to see if the timer has been cleared.
		clearTimeout(obj.waitTimer);
		obj.waitTimer = null;

		$('#iopMaskingDiv').hide();
	}

	/**
	 * Handle success for sync calls.
	 *
	 * @param obj
	 * @param response
	 */
	var handleSuccess = function(obj, response) {
		console.log('Intuit handleSuccess(): ' + obj.waitTimer);

		// Hide waiting.
		waitingHide(obj);

		// Call the original success handler if there is one.
		if (obj.callerSuccessHandler) {
			obj.callerSuccessHandler.apply(obj, arguments);
		}
	}

	/**
	 * Handle error for sync calls.
	 *
	 * @param obj
	 * @param response
	 */
	var handleError = function(obj, response) {
		console.log('Intuit handleError(): ' + obj.waitTimer + ', ' + response.status + ', ' + response.responseJSON);

		var msg = "";
		var code = "";
		if (response.hasOwnProperty('responseJSON')) {
			try {
				var responseObj = JSON.parse(response.responseJSON);
				if (responseObj && responseObj.hasOwnProperty('error') && $.isArray(responseObj.error) && responseObj.error.length > 0) {
					msg = 'Status=' + response.status + ', ' + 'Code=' + responseObj.error[0].code + ', ' + 'Type=' + responseObj.error[0].type + ', ' + 'Message=' + responseObj.error[0].message;
					code = code + '-' + responseObj.error[0].code + '-' + responseObj.error[0].type;
				}
			}
			catch (e) {
				msg = "JSON parse error";
				code = response.status;
			}
		}
		console.log('Intuit handleError() JSON: ' + msg);

		// For debugging. Don't let the page reload and lose all logging.
		//return;

		// Hide waiting.
		waitingHide(obj);

		if (response.status == 400 || response.status == 403 || response.status == 0) {    // allow 403 for DD verfification
			// Errors caller should handle.
			if (obj.callerErrorHandler) {
				obj.callerErrorHandler.apply(obj, arguments);
			}
		}
		else {
			// Fatal errors.
			if (ownSyncConfig.errorCleanUp) {
				ownSyncConfig.errorCleanUp.apply();
			}
			if (typeof ownSyncConfig.errorPage == 'string') {
				location.assign(ownSyncConfig.errorPage + '?Code=' + code);
			}
			else {
				ownSyncConfig.errorPage.apply(null, arguments);
			}
		}
	}

	/**
	 * Use the Intuit success/error handlers instead of the caller's success/error handler.
	 * Setup timer to show waiting.
	 *
	 * @param options
	 */
	var setSyncHandler = function(obj, options) {
		// Use Intuit error handler and save caller's error handler.
		obj.callerErrorHandler = null;
		if (options.hasOwnProperty('error')) {
			obj.callerErrorHandler = options.error;
		}
		options.error = handleError;

		// Use Intuit success handler and save caller's success handler.
		obj.callerSuccessHandler = null;
		if (options.hasOwnProperty('success')) {
			obj.callerSuccessHandler = options.success;
		}
		options.success = handleSuccess;

		// Set timer to show waiting.
		obj.waitTimer = null;
		obj.waitTimer = setTimeout(
			function() {
				console.log('Intuit show waiting: ' + obj.waitTimer);

				// Since clearing the timer is based on AJAX callbacks, this callback might have already
				// been queue up, can check for null to see if the timer has been cleared.
				if (obj.waitTimer) {
					$('#iopMaskingDiv').show();
				}
			},
			ownSyncConfig.waitTime);

		console.log('Intuit setSyncHandler(): ' + obj.waitTimer);
	}

	// Public declarations

	/**
	 * Concatenates the input options to the syncConfig object.
	 * Call this at application bootup time, roughly, to set global options
	 * that get applied to the Backbone.sync method.
	 *
	 * @param options
	 */
	Intuit.addSyncOptions = function(options) {
		console.log('Intuit.addSyncOptions(): ' + JSON.stringify(options));
		_.deepExtend(syncConfig, options);
	}

	/**
	 * These options are used locally and are not passed to the Backbone.sync method.
	 * Call this at application bootup time, roughly, to set global options.
	 *
	 * @param options
	 */
	Intuit.addOwnSyncOptions = function(options) {
		console.log('Intuit.addOwnSyncOptions(): ' + JSON.stringify(options));
		_.deepExtend(ownSyncConfig, options);
	}

    /**
     * Define the Intuit Model class.
     *
     * Main goal is to provide a layer where the application can hook into and extend the
     * model functionality as necessary.
     *
     * Based on Backbone.NestedModel, but we could change that, or use a mixin or whatever.
     *
     * Adds in any configured options from syncConfig.
     *
     * @type {*}
     */
    var Model = Intuit.Model = Backbone.NestedModel.extend({
        _superclass: Backbone.NestedModel.prototype, // specify superclass once

        fetch: function(options) {
            console.log('Intuit.Model.fetch(): ' + JSON.stringify(options));
            applySyncOptions(options);
			setSyncHandler(this, options);
            return this._superclass.fetch.apply(this, arguments);
        },

        save: function(attributes, options) {
            console.log('Intuit.Model.save(): ' + JSON.stringify(options));
            applySyncOptions(options);
			setSyncHandler(this, options);
            return this._superclass.save.apply(this, arguments);
        }
    });

    /**
     * Define the Intuit Collection class.
     *
     * Common extension point for all collections.
     *
     * Adds in any configured options from syncConfig.
     *
     * @type {*}
     */
    var Collection = Intuit.Collection = Backbone.Collection.extend({
        _superclass: Backbone.Collection.prototype,

        fetch: function(options) {
            console.log('Intuit.Collection.fetch(): ' + JSON.stringify(options));
            applySyncOptions(options);
			setSyncHandler(this, options);
            return this._superclass.fetch.apply(this, arguments);;
        }

    });

    return Intuit;
});