/**
 * @author    Edward Pfremmer <epfremme@nerdery.com>
 * @copyright Copyright (c) 2014, The Nerdery.
 * @see       https://nerdery.com
 * @package   plugins.matrixHierarchy
 */

(function () {
    window.Nerdery = window.Nerdery || {};

    /**
     * DataObserver Constructor
     *
     * @param {function} accessor
     * @param {function} handler
     * @param {int} [delay=100] - Delay in milliseconds
     * @constructor
     */
    var DataObserver = function (accessor, handler, delay) {
        this.accessor = accessor;
        this.handler = handler;
        this.delay = delay || 100;
        this.interval = null;
        this.lastValue = undefined;

        return this.init();
    };

    /** @prototype */
    DataObserver.prototype = {
        /**
         * Initialize sample interval to test for change in data/state
         *
         * @returns {DataObserver}
         */
        init: function () {
            this.interval = setInterval(this.test.bind(this), this.delay);

            return this;
        },

        /**
         * Stop observing for value changes
         *
         * @return void
         */
        destroy: function () {
            clearInterval(this.interval);
        },

        /**
         * Test if the value being observed has changed. On change in
         * state pass it to the user specified handler function
         *
         * @return void
         */
        test: function () {
            var currentValue = this.accessor();

            if (this.lastValue !== currentValue) {
                this.handler(currentValue);
                this.destroy();
            }

            this.lastValue = currentValue;
        }
    };

    Nerdery.DataObserver = DataObserver;
})();
