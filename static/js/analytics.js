/*
 * (c)2013 Intuit Inc. All rights reserved.
 * Unauthorized reproduction is a violation of applicable law
 */
define([
  'underscore',
  'config'
  ], function(_, appConfig) {
  var settings = appConfig.getAnalyticsSettings();

  var AnalyticsLogger = function() {
    if(settings.enabled) {
      // Initialize SiteCatalyst
      window.wa = {
         siteName: 'ems',
        siteGroup: 'prod',
         siteHost: '1099C',
           iopAll: 'false'
      }

      require([settings.googleAnalyticsSource, settings.siteCatalystSource], function() {
        if(window._gaq && _.isFunction(window._gaq.push)) {
          window._gaq.push(['_setAccount', 'UA-34292858-1']);
          // SiteCatalyst lib auto-logs the current path when the script loads, so we just need
          //  to specifically log via Google Analytics
          window._gaq.push(['_trackPageview', window.location.pathname]);
        }
      });
    } else if (settings.debugEnabled) {
      alert("would have ensured that sitecatalyst is loaded now...");
    }
  };

  AnalyticsLogger.prototype.trackEvent = function track_Event(event) {
    if (settings.enabled) {
      if(window._gaq && _.isFunction(window._gaq.push)) {
        // Log to Google Analytics (with cloned, augmented event description)
        var gaEvent = event.slice(0);
        gaEvent.unshift('_trackEvent');
        window._gaq.push(gaEvent);
      }

      if(window.wa && _.isFunction(window.wa.trackLink)) {
        // Log to SiteCatalyst
        var scEvent = event.join(" ");
        window.wa.trackLink(this, scEvent);
      }
    } else if (settings.debugEnabled) {
      alert("TRACKING would have logged trackEvent now, where event contains: " + event.join(" "));
    }
  };

  AnalyticsLogger.prototype.trackPageview = function track_Pageview(options) {
    if (settings.enabled) {
      if (window._gaq && _.isFunction(window._gaq.push)) {
        // Log to Google Analytics
        window._gaq.push(['_trackPageview', options["pagePath"]]);
      }

      if (window.wa && _.isFunction(window.wa.trackPage)) {
        // Log to SiteCatalyst
        window.wa.trackPage(options);
      }
    } else if (settings.debugEnabled) {
      var pagePath = options["pagePath"];
      alert("TRACKING would have logged trackPageview now, where options:pagePath is: " + pagePath);
    }
  };

  return new AnalyticsLogger();
});
