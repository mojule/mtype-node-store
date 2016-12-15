# mtype-node-store

Storage mechanism for mojule nodes. Defaults to in-memory, or pass an adapter
for other stores

```javascript
const Store = require( 'mtype-node-store' )

const person = {

}

Store( 'people' )
  .then(
    store => store.save(  )
  )
```