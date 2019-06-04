/**
 * @author    Edward Pfremmer <epfremme@nerdery.com>
 * @copyright Copyright (c) 2014, The Nerdery.
 * @see       https://nerdery.com
 * @package   plugins.matrixHierarchy
 */

(function () {
    window.Nerdery = window.Nerdery || {};

    var LAYER_START_HANDLE_PREFIX = 'layerStart';
    var CONTAINER_START_HANDLE_PREFIX = 'containerStart';
    var LAYER_END_HANDLE = 'containerEnd';
    var CONTAINER_END_HANDLE = 'layerEnd';

    /**
     * NestedMatrixBlock constructor
     *
     * @param {jQuery} $block
     * @param {jQuery} $field
     * @param {Nerdery.NestedMatrix} parent
     * @returns {Nerdery.NestedMatrixBlock}
     * @constructor
     */
    var NestedMatrixBlock = function ($block, $field, parent) {
        this.$block = $block;
        this.$field = $field;
        this.$settingsBtn = $block.find(' > .actions > .menubtn');
        this.settingsMenu = this.$settingsBtn.data('menubtn');
        this.parent = parent;
        this.children = [];
        this.isContainerStart = false;
        this.isContainerEnd = false;
        this.buttons = null;

        return this.init();
    };

    /** @prototype */
    NestedMatrixBlock.prototype = {
        /**
         * Initialize nested matrix block
         *
         * @returns {NestedMatrixBlock}
         */
        init: function () {
            var handle = this.getHandle();

            this.isContainerStart = handle.substring(0, 10) === LAYER_START_HANDLE_PREFIX || handle.substring(0, 14) === CONTAINER_START_HANDLE_PREFIX;
            this.isContainerEnd = handle === CONTAINER_END_HANDLE || handle === LAYER_END_HANDLE;

            return this.layout();
        },

        /**
         * Layout depended layer & wrapper block components
         *
         * @returns {NestedMatrixBlock}
         */
        layout: function () {
            if (this.isContainerStart) {
                this.$block.append('<div class="blocks"><div class="hidden js-block-end"></div></div>');
                this.buttons = new Nerdery.NestedMatrixButtons(this);
            }

            if (this.isContainerEnd) {
                this.$block.hide();
            }

            this.initSettingsMenu();

            return this;
        },

        /**
         * Initialize the block drop-down settings menu after pimped craft
         * menu UI components have finished being initialized
         *
         * @return {void}
         */
        initSettingsMenu: function () {
            var $settingsBtn = this.$settingsBtn;

            new Nerdery.DataObserver(
                function () {
                    return $settingsBtn.data('menubtn');
                },
                function (settingsMenu) {
                    this.settingsMenu = settingsMenu;
                    this.settingsMenu.menu.$options.filter('[data-type$=End]').parent().addClass('hidden');
                }.bind(this)
            );
        },

        /**
         * Return block handle
         *
         * @returns {string}
         */
        getHandle: function () {
            return this.$block.find('input:hidden:first').val();
        },

        /**
         * Add a new child block to this layer/wrapper block
         *
         * @param {NestedMatrixBlock} block
         */
        add: function (block) {
            this.children.push(block);

            block.isContainerEnd ?
                this.$block.find(' > .blocks > .js-block-end').after(block.$block) :
                this.$block.find(' > .blocks > .js-block-end').before(block.$block);
        },

        /**
         * Insert a new child block at its current position to
         * this layer/wrapper block
         *
         * @param {NestedMatrixBlock} block
         */
        insert: function (block) {
            var position = this.$block.find('.blocks > .matrixblock').index(block.$block);

            this.children.splice(position, 0, block);
        },

        /**
         * Serialize nested block data and hierarchy
         *
         * @returns {Object}
         */
        serialize: function () {
            return {
                id: this.$block.data('id'),
                type: this.$block.find('input:hidden:first').val(),
                children: this.children
                    .filter(function (block) {
                        return !block.isContainerEnd;
                    })
                    .map(function (block) {
                        return block.serialize();
                    })
            };
        }
    };

    window.Nerdery.NestedMatrixBlock = NestedMatrixBlock;
})();
