'use strict'

const assert = require( 'assert' )
const utils = require( 'mojule-utils' )
const Store = require( '../' )

const { id, matches } = utils

const valid = [
  {
    _id: id( 'person' ),
    nodeType: 'person',
    name: 'Nik',
    category: 'programmer'
  },
  {
    _id: id( 'person' ),
    nodeType: 'person',
    name: 'Andy',
    category: 'programmer'
  },
  {
    _id: id( 'person' ),
    nodeType: 'person',
    name: 'Alice',
    category: 'analyst'
  },
  {
    _id: id( 'dog' ),
    nodeType: 'dog',
    name: 'Spot',
    category: 'programmer'
  }
]

describe( 'Store', () => {
  it( 'creates a named store', () =>
    Store( 'someStore' )
      .then( store => {
        assert( store )
      })
  )

  it( 'saves a valid node', () =>
    Store( 'save' )
      .then( store =>
        store.save( valid[ 0 ] )
      )
  )

  it( 'exists', () =>
    Store( 'exists' )
      .then( store =>
        store.save( valid[ 0 ] )
          .then( () => store )
      )
      .then( store =>
        store.exists( valid[ 0 ]._id )
      )
      .then( exists => {
        assert( exists )
      })
  )

  it( 'loads', () =>
    Store( 'load' )
      .then( store =>
        store.save( valid[ 0 ] )
          .then( () => store )
      )
      .then( store =>
        store.load( valid[ 0 ]._id )
      )
      .then( person => {
        assert( person )
        assert( matches( person.value, valid[ 0 ] ))
      })
  )

  it( 'gets', () =>
    Store( 'get' )
      .then( store =>
        Promise.all([
          store.save( valid[ 0 ] ),
          store.save( valid[ 1 ] ),
          store.save( valid[ 2 ] ),
          store.save( valid[ 3 ] )
        ])
        .then( () => store )
      )
      .then( store =>
        store.get( 'person' )
      )
      .then( people => {
        assert( Array.isArray( people ) )
        assert.equal( people.length, 3 )
        assert( matches( people[ 0 ].value, valid[ 0 ] ))
        assert( matches( people[ 1 ].value, valid[ 1 ] ))
        assert( matches( people[ 2 ].value, valid[ 2 ] ))
      })
  )

  it( 'removes', () =>
    Store( 'remove' )
      .then( store =>
        Promise.all([
          store.save( valid[ 0 ] ),
          store.save( valid[ 1 ] )
        ])
        .then( () => store )
      )
      .then( store =>
        store.remove( valid[ 1 ]._id )
          .then( () => store )
      )
      .then( store =>
        store.get( 'person' )
      )
      .then( people => {
        assert( Array.isArray( people ) )
        assert.equal( people.length, 1 )
        assert( matches( people[ 0 ].value, valid[ 0 ] ))
      })
  )

  it( 'all', () =>
    Store( 'all' )
      .then( store =>
        Promise.all([
          store.save( valid[ 0 ] ),
          store.save( valid[ 1 ] ),
          store.save( valid[ 2 ] ),
          store.save( valid[ 3 ] )
        ])
        .then( () => store )
      )
      .then( store =>
        store.all()
      )
      .then( nodes => {
        assert( Array.isArray( nodes ) )
        assert.equal( nodes.length, 4 )
        assert( matches( nodes[ 0 ].value, valid[ 0 ] ))
        assert( matches( nodes[ 1 ].value, valid[ 1 ] ))
        assert( matches( nodes[ 2 ].value, valid[ 2 ] ))
        assert( matches( nodes[ 3 ].value, valid[ 3 ] ))
      })
  )

  it( 'find', () =>
    Store( 'find' )
      .then( store =>
        Promise.all([
          store.save( valid[ 0 ] ),
          store.save( valid[ 1 ] ),
          store.save( valid[ 2 ] ),
          store.save( valid[ 3 ] )
        ])
        .then( () => store )
      )
      .then( store =>
        store.find({ category: 'programmer' })
      )
      .then( programmers => {
        assert( Array.isArray( programmers ) )
        assert.equal( programmers.length, 3 )
        assert( matches( programmers[ 0 ].value, valid[ 0 ] ))
        assert( matches( programmers[ 1 ].value, valid[ 1 ] ))
        assert( matches( programmers[ 2 ].value, valid[ 3 ] ))
      })
  )

  it( 'creates id', () =>
    Store( 'id' )
      .then( store =>
        store.save( valid[ 4 ] )
          .then( () => store )
      )
      .then( store =>
        store.load( valid[ 4 ]._id )
      )
      .then( dog => {
        assert( dog )
        assert( dog.value._id )
        assert( dog.value._id.startsWith( 'dog' ) )
      })
  )
})
