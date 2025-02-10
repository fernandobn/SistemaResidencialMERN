import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
// Importa Footer si ya lo tienes creado
import Footer from "./components/Footer"; 
import Home from "./components/Home";
import Ubicacion from "./components/NuevaUbicacion";
import ListarUbicaciones from "./components/ListarUbicaciones";
import EditarUbicacion from "./components/EditarUbicacion";
import NuevoProyecto from "./components/NuevoProyecto";
import ListarProyectos from "./components/ListarProyectos";
import EditarProyecto from "./components/EditarProyecto";
import NuevoPresupuesto from "./components/NuevoPresupuesto";
import ListarPresupuestos from "./components/ListarPresupuestos";
import EditarPresupuesto from "./components/EditarPresupuesto";
import NuevoPermiso from "./components/NuevoPermiso";
import ListarPermisos from './components/ListarPermisos';  // Asegúrate de que la ruta sea correcta
function App() {
  return (
    <Router>
      {/* ✅ El Header aparece en todas las páginas */}
      <Header />

      {/* 📌 Rutas de la aplicación */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ubicacion" element={<Ubicacion />} />
        <Route path="/listarUbicaciones" element={<ListarUbicaciones />} />
        <Route path="/editarUbicacion/:id" element={<EditarUbicacion />} />

        {/* Rutas de proyectos */}
        <Route path="/nuevoProyecto" element={<NuevoProyecto />} />
        <Route path="/listarProyectos" element={<ListarProyectos />} />
        <Route path="/editarProyecto/:id" element={<EditarProyecto />} />
        
        {/* Rutas de presupuestos */}
        <Route path="/nuevoPresupuesto" element={<NuevoPresupuesto />} />
        <Route path="/listarPresupuestos" element={<ListarPresupuestos />} />
        <Route path="/editarPresupuesto/:id" element={<EditarPresupuesto />} />
        
        {/* Rutas de permisos */}
        <Route path="/nuevoPermiso" element={<NuevoPermiso />} />
        <Route path="/listarPermisos" element={<ListarPermisos />} />
      </Routes>

      {/* ✅ El Footer aparece en todas las páginas */}
      <Footer />
    </Router>
  );
}

export default App;
