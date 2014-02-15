/**
 * Created with IntelliJ IDEA.
 * User: shikham247
 * Date: 9/19/13
 * Time: 3:34 PM
 * Credits - http://stackoverflow.com/questions/8853396/logical-operator-in-a-handlebars-js-if-conditional,
 *           http://stackoverflow.com/questions/13810484/handlebars-helper-in-requirejs
 */

define(['Handlebars'],

function (Handlebars) {

    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

        switch (operator) {
            case "!=":
            return (v1!=v2)?options.fn(this):options.inverse(this);

            case "===":
            return (v1===v2)?options.fn(this):options.inverse(this);

            case "&&":
            return (v1&&v2)?options.fn(this):options.inverse(this);

            case "||":
            return (v1||v2)?options.fn(this):options.inverse(this);

            case "<":
            return (v1<v2)?options.fn(this):options.inverse(this);

            case "<=":
            return (v1<=v2)?options.fn(this):options.inverse(this);

            case ">":
            return (v1>v2)?options.fn(this):options.inverse(this);

            case ">=":
            return (v1>=v2)?options.fn(this):options.inverse(this);

            default:
            return eval(""+v1+operator+v2)?options.fn(this):options.inverse(this);
        }
    });
});