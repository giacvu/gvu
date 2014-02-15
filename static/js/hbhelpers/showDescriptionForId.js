/**
 * Created with IntelliJ IDEA.
 * User: shikham247
 * Date: 10/4/13
 * Time: 2:17 PM
 * To change this template use File | Settings | File Templates.
 */

define(['Handlebars',
    'common/util/idDescriptionMap'],

function (Handlebars, IdDescriptionMap) {

    Handlebars.registerHelper('showDescriptionForId', function (field, id, options) {
        return IdDescriptionMap[field][id];
    });
});