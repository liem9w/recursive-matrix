/**
 * @author    Edward Pfremmer <epfremme@nerdery.com>
 * @copyright Copyright (c) 2014, The Nerdery.
 * @see       https://nerdery.com
 * @package   plugins.matrixHierarchy
 */

(function ($) {
    window.Nerdery = window.Nerdery || {};

    var MATRIX_BUTTONS_SELECTOR = '.matrix-field > .buttons';

    // store pristine matrix field buttons state before
    // they are polluted by Garnish menu creation
    $(MATRIX_BUTTONS_SELECTOR).each(function () {
        var $buttons = $(this);
        var $field = $buttons.parent();

        $field.data('pristine-buttons', $buttons.clone());
    });

    /**
     * NestedMatrixButtons constructor
     *
     * @param {Nerdery.NestedMatrixBlock} block
     * @returns {NestedMatrixButtons}
     * @constructor
     */
    var NestedMatrixButtons = function (block) {
        this.block = block;
        this.menuBtn = null;
        this.$addBlockBtnContainer = block.$field.data('pristine-buttons').clone();
        this.$addBlockBtnGroup = this.$addBlockBtnContainer.children('.btngroup');
        this.$addBlockBtnGroupBtns = this.$addBlockBtnGroup.children('.btn');
        this.$addBlockMenuBtn = this.$addBlockBtnContainer.children('.menubtn');

        return this.init()
            .layout();
    };

    /** @prototype */
    NestedMatrixButtons.prototype = {
        /**
         * Initialize matrix buttons instance and dependencies
         *
         * @returns {NestedMatrixButtons}
         */
        init: function () {
            this.menuBtn = new Garnish.MenuBtn(this.$addBlockMenuBtn, {
                onOptionSelect: $.proxy(function (elem) {
                    this.addBlock($(elem).data('type'))
                }, this)
            });

            return this;
        },

        /**
         * Layout child elements and layout state
         *
         * @returns {NestedMatrixButtons}
         */
        layout: function () {
            var pimpedMenu = this.block.$field.find(' > .buttons-pimped .menubtn.hidden').data('menubtn');
            var $pimpedOptions = pimpedMenu ? pimpedMenu.menu.$options : $([]);
            var $menuBtnOptions = this.menuBtn.menu.$options;

            if ($pimpedOptions.length) {
                // hide options not available in pimped menu
                $menuBtnOptions.filter(function () {
                    return $pimpedOptions && !$pimpedOptions.filter('[data-type=' + $(this).data('type') + ']').length;
                }).parent().addClass('hidden');
            }

            // hide end layer/container block options from settings menu
            $menuBtnOptions.filter('[data-type$=End]').parent().addClass('hidden');

            this.block.$block.append(this.$addBlockBtnContainer);

            this.$addBlockBtnGroup.addClass('hidden');
            this.$addBlockMenuBtn.removeClass('hidden');

            return this;
        },

        /**
         * Add a new block to the matrix field this button is located in at
         * the appropriate nesting and block position
         *
         * @param {string} type
         */
        addBlock: function (type) {
            var $block = this.block.$block;

            new Nerdery.DataObserver(
                function () {
                    return $block.data('block');
                },
                function (block) {
                    block.matrix.addBlock(type, $block.find(' > .blocks > .js-block-end'));
                }
            );
        }
    };

    window.Nerdery.NestedMatrixButtons = NestedMatrixButtons;
})(jQuery);
