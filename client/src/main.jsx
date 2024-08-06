import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import InmuebleProvider from "./context/InmuebleContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { store, persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NextUIProvider } from "@nextui-org/react";
//import JuridicoProvider from "./context/JuridicoContext.jsx";
import { juridicoStore } from "./redux/juridicoStore.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <InmuebleProvider>
      <BrowserRouter>
       
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <NextUIProvider>
                <App />
              </NextUIProvider>
            </PersistGate>
          </Provider>
       
      </BrowserRouter>
    </InmuebleProvider>
  </AuthProvider>
);
