/**
 * Created with IntelliJ IDEA.
 * User: craigl719
 * Date: 1/9/14
 * Time: 8:53 AM
 * To change this template use File | Settings | File Templates.
 */

define(["backbone", "marionette"],

function(Backbone, Marionette) {

    if (typeof Intuit == "undefined" || !Intuit) {
        var Intuit = {};
    }

    /**
     * ASyncRegion
     *
     * Break the Marionette Region.show() flow into an onBeforeShow(),
     * then the render(), then the onShow() to allow a view to make async
     * model calls for the page.
     *
     * Derived classes MUST call the options.ready() parameter when the
     * rendering / showing should complete.
     *
     * @type {*}
     */
    var ASyncRegion = Intuit.ASyncRegion = Marionette.Region.extend({
        _superclass: Marionette.Region.prototype,

        show: function(view) {
            console.log("invoking ASyncRegion.show()");

            var self = this;
            Marionette.triggerMethod.call(view, "before:show", {
                ready: function() {
                    console.log("invoking ASyncRegion.before:show READY callback");
                    // call base class show()
                    self._show(view);
                }
            });

        },

        _show: function(view) {
            console.log("invoking ASyncRegion._show()");
            // call base class show()
            return this._superclass.show.apply(this, arguments);
        }

    });

    return ASyncRegion

});