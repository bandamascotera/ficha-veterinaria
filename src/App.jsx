import { useState } from "react";
import Propietarios from "./Propietarios";
import Pacientes from "./Pacientes";
import Consultas from "./Consultas";
import FichaPaciente from "./FichaPaciente";
import "./App.css";
import logo from "./assets/logo.png";

export default function App() {
  const [vista, setVista] = useState("inicio");
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  function renderVista() {
    switch (vista) {
      case "propietarios":
        return <Propietarios />;
      case "pacientes":
  return (
    <Pacientes
      setVista={setVista}
      setPacienteSeleccionado={setPacienteSeleccionado}
    />
  );
      case "consultas":
        return <Consultas />;
      case "ficha":
        return (
          <FichaPaciente
            pacienteId={pacienteSeleccionado}
          />
        );
      default:
        return (
          <div className="dashboard">
            <h2>Bienvenido al Sistema Veterinario</h2>
            <p>Seleccioná una opción del menú para comenzar.</p>
          </div>
        );
    }
  }

  return (
    <div className="app-container">
      
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo-container">
  <img src={logo} alt="La Banda Mascotera" />
  
</div>
<p className="brand-name">La Banda Mascotera</p>

        <button onClick={() => setVista("inicio")}>
          Dashboard
        </button>

        <button onClick={() => setVista("propietarios")}>
          Propietarios
        </button>

        <button onClick={() => setVista("pacientes")}>
          Pacientes
        </button>

        <button onClick={() => setVista("consultas")}>
          Consultas
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="main">
        <div className="header">
          <h2>La Banda Mascotera - Sistema Clínico Veterinario</h2>
        </div>

        <div className="content">
          {renderVista()}
        </div>

        {/* MENU MOBILE */}
        <div className="mobile-nav">

        <button onClick={() => setVista("propietarios")}>
          👤
          <span>Propietarios</span>
        </button>

        <button onClick={() => setVista("pacientes")}>
          🐶
          <span>Pacientes</span>
        </button>

        <button onClick={() => setVista("consultas")}>
          🩺
          <span>Consultas</span>
        </button>

        </div>
      </div>
    </div>

    
  );
}