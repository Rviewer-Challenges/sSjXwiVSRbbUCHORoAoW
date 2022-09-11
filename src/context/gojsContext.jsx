import { createContext } from 'react'
import * as go from 'gojs'

export const goJsContext = createContext({
  $: null,
  diagram: null,
  palette: null,
})

export const CreatreGoJsContext = ({ children }) => {
  return (
    <goJsContext.Provider
      value={{
        $: go.GraphObject.make,
        diagram: go.GraphObject.make(go.Diagram),
        palette: go.GraphObject.make(go.Palette),
      }}
    >
      {children}
    </goJsContext.Provider>
  )
}
