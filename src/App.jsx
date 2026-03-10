import { useState } from "react";
import Propietarios from "./Propietarios";
import Pacientes from "./Pacientes";
import Consultas from "./Consultas";
import FichaPaciente from "./FichaPaciente";
import "./App.css";
import logo from "./assets/logo.png";
import Login from "./Login"
import { supabase } from "./supabaseClient"
import { useEffect } from "react"
import PortalCliente from "./PortalCliente"

"comentario"

export default function App() {
  const [vista, setVista] = useState("inicio");
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [user, setUser] = useState(null)
  const [rol, setRol] = useState(null)

  async function logout(){
    await supabase.auth.signOut()
    setUser(null)
  }

  useEffect(() => {

  async function cargarSesion(session){

    const usuario = session?.user

    if (!usuario) {
      setUser(null)
      setRol(null)
      return
    }

    setUser(usuario)

    const { data } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("id", usuario.id)
      .single()

    if (data) {
      setRol(data.rol)
    }

  }

  // sesión inicial
  supabase.auth.getSession().then(({ data }) => {
    cargarSesion(data.session)
  })

  // escuchar cambios de sesión
  const { data: listener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      cargarSesion(session)
    }
  )

  return () => {
    listener.subscription.unsubscribe()
  }

  }, [])

  

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

  if (!user) {
    return <Login setUser={setUser} />
  }

  if (rol === "propietario") {
  return <PortalCliente user={user} logout={logout} />
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

        <button onClick={logout}>
        Cerrar sesión
        </button>

      </div>

      {/* CONTENIDO */}
      <div className="main">
          <div className="header">
            <img src={logo} className="header-logo" />
            <div className="header-text">
                <h2>La Banda Mascotera</h2>
                <span>Sistema Clínico Veterinario</span>
            </div>
          </div>

        <div className="content">
          {renderVista()}
        </div>

        {/* MENU MOBILE */}
        <div className="mobile-nav">

        <button onClick={() => setVista("inicio")}>
        🏠
        <span>Inicio</span>
        </button>

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

        <button onClick={logout}>
          🚪
          <span>Salir</span>
        </button>

        </div>
      </div>
    </div>

    
  );
}