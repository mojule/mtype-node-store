'use strict'

const EntityNode = require( 'mtype-node' )
const Events = require( 'mevents' )
const utils = require( 'mojule-utils' )

const { matches } = utils

const typeError = ( fnName, argName, expectType ) =>
  new TypeError( `${ fnName } expects ${ argName } to be ${ expectType }` )

const defaults = {
  find: ( api, source ) => {
    const allCandidates = typeof source.nodeType === 'string' ?
      api.get( source.nodeType ) :
      api.all()

    return allCandidates
      .then( candidates =>
        candidates.filter( node => matches( node.value, source ) )
      )
  }
}

const BaseStore = adapter => {
  const events = Events()

  const exists = id => {
    if( typeof id !== 'string' )
      typeError( 'Store.exists', 'id', 'a string' )

    return adapter.exists( id )
  }

  const save = obj => {
    if( EntityNode.mtype.is( obj, 'entityNodeValue' ) ){
      obj = EntityNode( obj.nodeType, obj )
    }

    if( !EntityNode.mtype.is( obj, 'entityNode' ) ){
      typeError( 'Store.save', 'obj', 'an entityNode' )
    }

    const now = ( new Date() ).toJSON()

    if( typeof obj.value._created !== 'string' )
      obj.value._created = now

    obj.value._updated = now

    events.emit( 'save', obj )

    return adapter.save( obj )
  }

  const load = id => {
    if( typeof id !== 'string' && !Array.isArray( id ) )
      typeError( 'Store.load', 'id', 'a string or an array' )

    return adapter.load( id )
  }

  const get = nodeType => {
    if( typeof nodeType !== 'string' )
      typeError( 'Store.get', 'nodeType', 'a string' )

    return adapter.get( nodeType )
  }

  const remove = id => {
    if( typeof id !== 'string' )
      typeError( 'Store.remove', 'id', 'a string' )

    events.emit( 'remove', id )

    return adapter.remove( id )
  }

  const find = source => {
    if( typeof source !== 'object' )
      typeError( 'Store.find', 'id', 'a string' )

    if( typeof adapter.find === 'function' )
      return adapter.find( source )

    return defaults.find( api, source )
  }

  const all = () => {
    return adapter.all()
  }

  const on = events.on

  const api = {
    exists, save, load, get, remove, all, on, find
  }

  return api
}

module.exports = BaseStore
