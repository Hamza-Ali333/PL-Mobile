import React, { createContext } from 'react'

const SocketContext = createContext({})

export const SocketProvider = SocketContext.Provider

export const SocketConsumer = SocketContext.Consumer

export const withSocketHOC = Component => props => (
  <SocketConsumer>
    {state => <Component {...props} socket={state} />}
  </SocketConsumer>
)