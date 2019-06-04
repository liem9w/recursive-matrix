/**
 * @author    Edward Pfremmer <epfremme@nerdery.com>
 * @copyright Copyright (c) 2014, The Nerdery.
 * @see       https://nerdery.com
 * @package   plugins.matrixHierarchy
 */

(function () {
    window.Nerdery = window.Nerdery || {};

    /**
     * NestedMatrix constructor
     *
     * @param {jQuery} $field
     * @param {string} field
     * @returns {Nerdery.NestedMatrix}
     * @constructor
     */
    var NestedMatrix = function ($field, field) {
        this.$field = $field;
        this.field = field;
        this.blocks = [];

        return this.init();
    };

    /** @prototype */
    NestedMatrix.prototype = {
        /**
         * Initialize nested matrix input field
         *
         * Initializes matrix blocks to represent nested hierarchy based on block position in relation
         * to it's parent wrapper blocks in the default flat matrix structure
         *
         * @returns {NestedMatrix}
         */
        init: function () {
            var $field = this.$field;
            var $blocks = $field.find('.matrixblock');
            var parentStack = [];

            this.blocks = $blocks.map(function () {
                var parent = parentStack.length ? parentStack[0] : null;
                var block = new Nerdery.NestedMatrixBlock($(this), $field, parent);

                if (block.isContainerStart) {
                    parentStack.unshift(block);
                }

                if (block.isContainerEnd) {
                    parentStack.shift();
                }

                return block;
            });

            this.blocks.each(function () {
                if (this.parent) {
                    this.parent.add(this);
                }
            });

            return this.layout();
        },

        /**
         * Initialize nested hierarchy input field for this matrix input field
         *
         * @returns {NestedMatrix}
         */
        layout: function () {
            this.$hierarchyInput = $('<input type="hidden" name="matrix_hierarchies['+ this.field +']" />');
            this.$field.prepend(this.$hierarchyInput);

            // hide end layer/container block options from default and pimped matrix add block menus
            this.$field.children('.buttons, .buttons-pimped').find('.menubtn').each(function () {
                $(this).data('menubtn').menu.$options.filter('[data-type$=End]').parent().addClass('hidden');
            });

            return this;
        },

        /**
         * Add new matrix block to this nested matrix input field
         *
         * @param {jQuery} $block
         */
        add: function ($block) {
            var $parent = $block.parents('.matrixblock');
            var parent = this.blocks.filter(function () {
                return this.$block.get(0) === $parent.get(0);
            })[0];

            var block = new Nerdery.NestedMatrixBlock($block, this.$field, parent);

            if (block.isContainerEnd) {
                parent && parent.add(block);
            } else {
                parent && parent.insert(block);
            }

            if (block.isContainerStart) {
                block.buttons.addBlock(
                    // add matching container end block type
                    block.getHandle() === 'layerStartBase' ? 'layerEnd' : 'containerEnd'
                );
            }

            // insert new block into blocks array at its final position
            this.blocks.splice(this.$field.find('.matrixblock').index($block), 0, block);
        },

        /**
         * Update value of the matrix field hierarchy input
         *
         * @returns void
         */
        updateHierarchyField: function () {
            this.$hierarchyInput.val(JSON.stringify(this.getHierarchy()));
        },

        /**
         * Return serialized hierarchy data for the nested matrix
         *
         * @returns {Object}
         */
        getHierarchy: function () {
            return this.blocks
                .filter(function () {
                    return !this.parent;
                })
                .map(function () {
                    return this.serialize()
                })
                .toArray()
            ;
        }
    };

    window.Nerdery.NestedMatrix = NestedMatrix;
})();
