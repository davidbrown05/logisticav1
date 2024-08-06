import { useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import "./index.css";
import { Propiedades } from "./pages/Propiedades";
import { Juridico } from "./pages/Juridico";
import { CrearPropiedad } from "./pages/CrearPropiedad";
import { Header } from "./components/Header";
import { Ventas } from "./pages/Ventas";
import { PagosyAdeudos } from "./pages/PagosyAdeudos";
import { PropertyDeuda } from "./pages/PropertyDeuda";
import { Comisiones } from "./pages/Comisiones";
import { Deuda } from "./pages/Deuda";
import { Login } from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Compradores } from "./pages/Compradores";
import { Signup } from "./pages/Signup";
import { Usuarios } from "./pages/Usuarios";
import { CrearComprador } from "./pages/CrearComprador";
import { ProtectedRoutes } from "./ProtectedRoutes";
import ReduxPrivateRoute from "./ReduxPrivateRoute";
import Reportes from "./pages/Reportes";
import Permisos from "./pages/Permisos";
import PermisosDnD from "./pages/PermisosDnd";
import Adeudos from "./pages/Adeudos";
import EditarPropiedad from "./pages/EditarPropiedad";
import EditarComprador from "./pages/EditarComprador"
import EditarUsuario from "./pages/EditarUsuario"

function App() {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const location = useLocation();

  // Verifica si la ruta actual es la de login
  const isLoginPage = location.pathname === "/";

  return (
    <>
      {/* <Header openSideMenu={openSideMenu} setOpenSideMenu={setOpenSideMenu} /> */}
      {!isLoginPage && (
        <Header openSideMenu={openSideMenu} setOpenSideMenu={setOpenSideMenu} />
      )}

      <Routes>
        <Route path="/" element={<Login></Login>}></Route>
        <Route element={<ReduxPrivateRoute />}>
          <Route
            path="crear"
            element={<CrearPropiedad></CrearPropiedad>}
          ></Route>
          <Route path="usuarios" element={<Usuarios></Usuarios>}></Route>
          <Route path="reportes" element={<Reportes></Reportes>}></Route>
          <Route path="signup" element={<Signup></Signup>}></Route>
          <Route
            path="compradores"
            element={<Compradores></Compradores>}
          ></Route>
          <Route
            path="crearcomprador"
            element={<CrearComprador></CrearComprador>}
          ></Route>
          <Route
            path="inventario"
            element={<Propiedades></Propiedades>}
          ></Route>
          <Route path="editar/:id" element={<EditarPropiedad></EditarPropiedad>}></Route>
          <Route path="juridico/:id" element={<Juridico></Juridico>}></Route>
          <Route path="ventas/:id" element={<Ventas></Ventas>}></Route>
          <Route
            path="pagosadeudos/:id"
            element={<PagosyAdeudos></PagosyAdeudos>}
          ></Route>
          <Route path="adeudos/:id" element={<Adeudos></Adeudos>}></Route>
          <Route
            path="propertydeuda/:id"
            element={<PropertyDeuda></PropertyDeuda>}
          ></Route>
          <Route
            path="comisiones/:id"
            element={<Comisiones></Comisiones>}
          ></Route>
          <Route path="deuda" element={<Deuda></Deuda>}></Route>
          <Route path="permisos/:id" element={<Permisos></Permisos>}></Route>
          <Route
            path="permisos1/:id"
            element={<PermisosDnD></PermisosDnD>}
          ></Route>
          <Route
            path="editarcomprador/:id"
            element={<EditarComprador></EditarComprador>}
          ></Route>
          <Route
            path="editarusuario/:id"
            element={<EditarUsuario></EditarUsuario>}
          ></Route>
        </Route>
        <Route path="/*" element={<Navigate to="/"></Navigate>}></Route> 
      </Routes>

      <div>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
