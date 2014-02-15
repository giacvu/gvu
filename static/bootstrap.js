
require.config({
    baseUrl: "/static",
    urlArgs: "v=BUILD_VERSION",
    paths: {
        jquery: 'js/jquery-1.10.2-dev',
        jqueryui: 'js/jquery-ui',
        jquerycookie: 'js/jquery.cookie',
        backbone: 'js/backbone-1.0.0',
        underscore: 'js/underscore-1.4.4',
        marionette: 'js/backbone.marionette-noamd',//,
        Handlebars: 'js/handlebars', // uses 'Handlebars' in hbs template loader
        i18nprecompile: 'js/i18nprecompile', // used for hbs template loading plugin
        json2: 'js/json2', // used for hbs template loading plugin
        hbs: 'js/hbs', // used for hbs template loading plugin
        text: 'js/text', // loading text files with text! prefix - move to requirePlugins directory
        json: 'js/json', // loading JSON files with json! prefix - move to requirePlugins directory
        backgrid: 'js/backgrid',
        fetchCache: 'js/backbone.fetch-cache',
        modelBinder: 'js/Backbone.ModelBinder',
        backboneNested: 'js/backbone-nested',
        validator: 'js/backbone-validation',
        deepExtend: 'js/deepExtend',
        consoleLogger: 'js/console-logger'
    },
    shim: {
        jquery: {
            exports: 'jQuery'
        },
        jqueryui: {
            deps: ['jquery'],
            exports: 'jQueryUI'
        },
        jquerycookie: {
            deps: ['jquery'],
            exports: 'jQueryCookie'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        marionette: {
            deps: ['jquery', 'underscore', 'backbone'],
            exports: 'Marionette'
        },
        Handlebars: {
            exports: 'Handlebars'
        },
        backgrid: {
            deps:['jquery', 'underscore', 'backbone'],
            exports: 'Backgrid'
        },
        fetchCache: {
            deps:['underscore', 'backbone'],
            exports: 'FetchCache'
        },
        modelBinder: {
            deps:['jquery', 'underscore', 'backbone'],
            exports: 'ModelBinder'
        },
        backboneNested: {
            deps:['backbone'],
            exports: 'BackboneNested'
        },
        validator: {
            deps: ['jquery', 'underscore', 'backbone'],
            exports: 'Validator'
        },
        deepExtend: {
            deps:['underscore'],
            exports: 'deepExtend'
        }
    },
    // hbs specific configuration
    hbs: {
        disableI18n: true,
        templateExtension: false,
        helperDirectory: "lib/handlebarsHelpers/"
    }
});

require(['app'], function(app) {
	app.start();
});
