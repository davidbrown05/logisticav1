import React, { createContext,useState } from "react";

// Contexto del Loader
export const LoaderContext = createContext()

export function LoaderProvider({ children }) {
    const [loaderContext, setloaderContext] = useState(false)
  
    return (
      <LoaderContext.Provider value={{ loaderContext, setloaderContext }}>
        {children}
      </LoaderContext.Provider>
    )
  }
