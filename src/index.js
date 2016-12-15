'use strict'

const DefaultAdapter = require( './memoryAdapter' )
const BaseStore = require( './basestore' )

const Store = ( name, options ) => {
  options = Object.assign( {}, defaultOptions, options )

  const { Adapter } = options

  return Adapter( name, options ).then( adapter => BaseStore( adapter ) )
}

const defaultOptions = {
  Adapter: DefaultAdapter
}

module.exports = Store
