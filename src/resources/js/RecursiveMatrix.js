window.recursiveMatrix = new (function() {
  /**
   * Constructor
   *
   * Initialize app on document load
   */
  this.constructor = function() {
    $(this.init.bind(this))
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