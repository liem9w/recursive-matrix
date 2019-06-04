window.recursiveMatrix = new (function() {
  var _this = this

  /**
   * Constructor
   *
   * Initialize app on document load
   */
  this.constructor = function() {
    $(_this.init.bind(_this))
  }

  /**
   * Initialize app
   */
  this.init = function() {
    if (window.Craft && window.Craft.MatrixHierarchyPlugin) {
      window.matrixHierarchyPlugin = new Craft.MatrixHierarchyPlugin(['contentComponents']);
    }
  }

  this.constructor.apply(this, arguments)
})()