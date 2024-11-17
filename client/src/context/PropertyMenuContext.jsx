import React, { createContext,useState } from "react";

// Contexto del Loader
export const PropertyMenuContext = createContext()

export function PropertyMenuProvider({ children }) {
    const [PropertyMenuContext, setPropertyMenuContext] = useState(false)
  
    return (
      <PropertyMenuContext.Provider value={{ PropertyMenuContext, setPropertyMenuContext }}>
        {children}
      </PropertyMenuContext.Provider>
    )
  }
