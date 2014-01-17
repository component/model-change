
try {
  var clone = require('clone');
} catch (e) {
  var clone = require('clone-component');
}

/**
 * Expose `change`.
 */

module.exports = change;

/**
 * Return a `plugin` function with `options`.
 *
 * @param {Object} options (optional)
 *   @property {String} separator
 */

function change (options) {
  options = options || {};
  var separator = options.separator || ' ';

  return function plugin (Model) {

    /**
     * On save, reset any dirty attributes.
     */

    Model.on('save', function (model) {
      delete model._dirty;
    });

    /**
     * Define an `attr` with optional `options`, and create a getter/setter
     * method that emits change events when set.
     *
     * @param {String} attr
     * @param {Object} options (optional)
     * @return {Model}
     */

    Model.attr = function (attr, options) {
      options = options || {};
      Model.attrs[attr] = options;

      /**
       * Get or set a `val` and emit change events.
       *
       * @param {Mixed} val
       * @return {Mixed}
       */

      Model.prototype[attr] = function (val) {
        if (!arguments.length) return this.attrs[attr];
        var prev = this[attr]();
        if (prev == val) return this;

        this._dirty = this._dirty || {};
        this._dirty[attr] = true;
        this.attrs[attr] = val;
        this.Model.emit('change', this, attr, val, prev);
        this.Model.emit('change' + separator + attr, this, val, prev);
        this.emit('change', attr, val, prev);
        this.emit('change' + separator + attr, val, prev);
        return this;
      };

      return this;
    };

    /**
     * Check whether a specific `attr` is dirty or not. If no attr is specified,
     * it will return all of the dirty attrs, or false.
     *
     * @param {String} attr
     * @return {Object}
     */

    Model.prototype.changed = function (attr) {
      if (attr) return !! (this._dirty || {})[attr];
      if (this._dirty) return clone(this._dirty);
      return false;
    };

  };
}