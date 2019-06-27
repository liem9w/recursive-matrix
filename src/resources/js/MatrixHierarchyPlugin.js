/**
 * @author    Edward Pfremmer <epfremme@nerdery.com>
 * @copyright Copyright (c) 2014, The Nerdery.
 * @see       https://nerdery.com
 * @package   plugins.matrixHierarchy
 */

(function ($) {
    Craft.MatrixHierarchyPlugin = Garnish.Base.extend({
        /**
         * Array of initialized nested matrix
         * fields on the current page
         *
         * @type {Nerdery.NestedMatrix[]}
         */
        matrixFields: [],

        /**
         * Hash of decorated methods
         *
         * @type {object}
         */
        decoratedMethods: {},

        /**
         * Plugin enabled flag
         *
         * @type {boolean}
         */
        enabled: false,

        /**
         * Initialize the matrix hierarchy plugin
         *
         * @param {string[]} matrixFields
         * @returns {Craft.MatrixHierarchyPlugin}
         */
        init: function(matrixFields) {
            if (typeof Craft.MatrixInput !== 'undefined') {
                Craft.MatrixInput.prototype.addBlock = this._decorateMethod(Craft.MatrixInput.prototype.addBlock);
            }

            return this.layout(matrixFields)
                .setupHandlers()
                .enable();
        },

        /**
         * Layout nested matrix elements
         *
         * @param {string[]} matrixFields
         * @returns {Craft.MatrixHierarchyPlugin}
         */
        layout: function (matrixFields) {
            matrixFields = matrixFields || [];

            $(function () {
                setTimeout(function () {
                    this.matrixFields = matrixFields.map(function (field) {
                        return new Nerdery.NestedMatrix($('#fields-' + field), field);
                    });
                }.bind(this), 10);
            }.bind(this));

            return this;
        },

        /**
         * Setup event handlers
         *
         * @returns {Craft.MatrixHierarchyPlugin}
         */
        setupHandlers: function () {
            this.onSubmitHandler = this.onSubmit.bind(this);

            return this;
        },

        /**
         * Enable plugin
         *
         * @returns {Craft.MatrixHierarchyPlugin}
         */
        enable: function () {
            if (this.enabled) {
                return this;
            }

            this.enabled = true;

            $(document).on('submit', 'form#main-form', this.onSubmitHandler);

            return this;
        },

        /**
         * Disable plugin
         *
         * @returns {Craft.MatrixHierarchyPlugin}
         */
        disable: function () {
            if (!this.enabled) {
                return this;
            }

            this.enabled = false;

            $(document).off('submit', 'form#main-form', this.onSubmitHandler);

            return this;
        },

        /**
         * Handle form submit event
         *
         * @param {n.Event} e
         */
        onSubmit: function (e) {
            this.matrixFields.forEach(function (matrixField) {
                matrixField.updateHierarchyField();
            });
        },

        /**
         * Add block to both original matrix input and
         * nested matrix instances
         *
         * @param {string} type
         * @param {jQuery} $insertBefore
         * @param {Craft.MatrixInput} matrixInput
         */
        addBlock: function(type, $insertBefore, matrixInput) {
            if ($insertBefore instanceof Craft.MatrixInput) {
                matrixInput = $insertBefore;
                $insertBefore = null;
            }

            var field = this._getMatrixField(matrixInput);
            var $block = this._getTargetBlock(field.$field, $insertBefore);

            field && field.add($block);
        },

        /**
         * Search initialized matrix fields for matching input
         *
         * @param {Craft.MatrixInput} matrixInput
         * @returns {Nerdery.NestedMatrix}
         * @private
         */
        _getMatrixField: function (matrixInput) {
            return this.matrixFields.filter(function (field) {
                return field.$field.get(0) === matrixInput.$container.get(0);
            })[0];
        },

        /**
         * Find and return the last inserted matrix block
         *
         * @param {jQuery} $field
         * @param {jQuery} $insertBefore
         * @returns {jQuery}
         * @private
         */
        _getTargetBlock: function ($field, $insertBefore) {
            return $insertBefore ? $insertBefore.prev() : $field.find(' > .blocks  > .matrixblock:last');
        },

        /**
         * Wrap target method to also call an associated method on Craft.MatrixHierarchyPlugin
         * with the same method name to extend or decorate default craft functionality
         *
         * @param {Function} method
         * @returns {Function}
         * @private
         */
        _decorateMethod: function(method) {
            var decorator = this[method.name];
            var self = this;

            if (typeof method !== 'function' || typeof decorator !== 'function') {
                return method;
            }

            this.decoratedMethods[method.name] = method;

            return function () {
                var args = Array.prototype.slice.apply(arguments);

                method.apply(this, args);
                decorator.apply(self, args.concat([this]));
            };
        }
    });
})(jQuery);
