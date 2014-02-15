/**
 * Console logging configuration module.
 * Add "debug=true" query parameter to activate.
 * Add "debug=false" query parameter to deactivate.
 *
 * Possible improvements:
 * - Add a query param to set the log level.
 *
 */

define([], function() {

    //console.log("loading console-logger");

    var consoleLogMethods = [
           "log",
           "debug",
           "info",
           "warn",
           "error"];

    var consoleOtherMethods = [
           "assert",
           "clear",
           "count",
           "dir",
           "dirxml",
           "exception",
           "group",
           "groupCollapsed",
           "groupEnd",
           "markTimeline",
           "memoryProfile",
           "memoryProfileEnd",
           "profile",
           "profileEnd",
           "table",
           "time",
           "timeEnd",
           "timeStamp",
           "trace"];

    /**
     * Get the specified query parameter from the URL used to load the page.
     * I stole this from some blog on Stack Overflow.
     *
     * @param name
     * @returns {*}
     */
    function getUrlParam(name) {
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
            return null;
        } else{
            return results[1] || 0;
        }
    }

    /**
     * Disable the console object method by setting the method to a trivial
     * function that does nothing.
     *
     * @param prop
     */
    function trivializeMethod(prop) {
        window.console[prop] = function(){};
    }

    var DEBUG = false;

    var debugParam = getUrlParam('debug');

    if (debugParam !== undefined && debugParam !== null) {
        if (debugParam.toLowerCase() === 'true') {
            DEBUG = true;
        } else {
            DEBUG = false;
        }
    }

    /**
     * Check if console is not available or disabled via DEBUG state.
     * If the console is disabled, then set the console.* functions to be an
     * empty function that does nothing. Then our code will all still work.
     */

	if (typeof(window.console) === "undefined" || typeof(DEBUG) === "undefined" || (typeof(DEBUG) === "boolean" && !DEBUG)) {
		window.console = {};
		var i, props = consoleOtherMethods.concat(consoleLogMethods);
		for(i=0; i<props.length; i++) {
            trivializeMethod(props[i]);
		}
	}

});
