
var assert = require('assert');

try {
  var change = require('model-change');
  var create = require('model');
} catch (e) {
  var change = require('..');
  var create = require('../../model');
}

describe('model-change', function () {
  describe('.attr', function () {
    it('should store options', function () {
      var Model = create('user').use(change());
      var options = { option: true };
      Model.attr('name', options);
      assert.equal(options, Model.attrs.name);
    });

    it('should create a getter/setter', function () {
      var Model = create('user').use(change());
      Model.attr('name');
      var model = new Model();
      assert.equal('function', typeof model.name);
      assert.equal(model, model.name('value'));
      assert.equal('value', model.attrs.name);
      assert.equal('value', model.name());
    });
  });

  describe('#ATTR', function () {
    it('should set a dirty flag', function () {
      var Model = create('user').use(change()).attr('name');
      var model = new Model();
      model.name('new');
      assert.deepEqual({ name: true }, model._dirty);
    });

    it('should reset dirty attributes on save', function () {
      var Model = create('user').use(change()).attr('name');
      var model = new Model();
      model.name('new');
      Model.emit('save', model);
      assert(!model._dirty);
    });

    it('should emit change on the constructor', function (done) {
      var Model = create('user').use(change()).attr('name');
      var model = new Model({ name: 'prev' });

      Model.on('change', function (instance, attr, val, prev) {
        assert.equal(instance, model);
        assert.equal('name', attr);
        assert.equal('new', val);
        assert.equal('prev', prev);
        done();
      });

      model.name('new');
    });

    it('should emit change with separator on the constructor', function (done) {
      var Model = create('user').use(change()).attr('name');
      var model = new Model({ name: 'prev' });

      Model.on('change name', function (instance, val, prev) {
        assert.equal(instance, model);
        assert.equal('new', val);
        assert.equal('prev', prev);
        done();
      });

      model.name('new');
    });

    it('should emit change on the instance', function (done) {
      var Model = create('user').use(change()).attr('name');
      var model = new Model({ name: 'prev' });

      model.on('change', function (attr, val, prev) {
        assert.equal('name', attr);
        assert.equal('new', val);
        assert.equal('prev', prev);
        done();
      });

      model.name('new');
    });

    it('should emit change with separator on the instance', function (done) {
      var Model = create('user').use(change()).attr('name');
      var model = new Model({ name: 'prev' });

      model.on('change name', function (val, prev) {
        assert.equal('new', val);
        assert.equal('prev', prev);
        done();
      });

      model.name('new');
    });

    it('should accept a custom separator', function (done) {
      var Model = create('user').use(change({ separator: ':' })).attr('name');
      var model = new Model();
      model.on('change:name', function () { done(); });
      model.name('new');
    });
  });

  describe('#changed', function () {
    it('should return whether an attr is dirty', function () {
      var Model = create('user').use(change()).attr('name');
      var model = new Model();
      model.name('new');
      assert(model.changed('name'));
    });

    it('should return false if no attrs are dirty', function () {
      var Model = create('user').use(change()).attr('name');
      var model = new Model();
      assert(!model.changed());
    });

    it('should dirty attrs', function () {
      var Model = create('user').use(change()).attr('name');
      var model = new Model();
      model.name('new');
      assert.deepEqual({ name: true }, model.changed());
    });
  });
});
