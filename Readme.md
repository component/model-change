
# model-change

  A plugin that adds change events to models.

## Installation

    $ component install component/model-change

## Example

```js
var model = require('model');
var change = require('model-change');

/**
 * User model.
 */

var User = model()
  .use(change())
  .attr('id')
  .attr('name');

/**
 * Listen.
 */

var user = new User({ name: 'Fred' });

user.on('change name', function (attr, val, prev) {
  console.log('name changed from "' + prev + '" to "' + val + '"'); 
});

user.name('George');
```

## API

#### change([options])

  Return the plugin with optional `options`:

    separator: ' '

  Once applied, these events are emitted on the constructor:

```js
Model.emit('change', instance, attr, val, prev);
Model.emit('change<separator><attr>', instance, val, prev)
```

  And these events are emitted on the instance:

```js
model.emit('change', attr, val, prev);
model.emit('change<separator><attr>', val, prev);
```

#### #changed([attr])

  Check whether an `attr` has changed since the last save.

  When no `attr` is passed, the method either returns a dictionary of all the attributes that have changed, or `false` if none have changed.