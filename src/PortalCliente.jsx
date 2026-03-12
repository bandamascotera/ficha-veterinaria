    import { useState } from "react"
    import Mascotas from "./Mascotas"
    import logo from "./assets/logo.png";
    import FichaMascota from "./FichaMascota"
    import Historial from "./Historial"
    import Vacunas from "./Vacunas"

    export default function PortalCliente({ user, logout }) {

    const [vista,setVista] = useState("inicio")
    const [pacienteSeleccionado,setPacienteSeleccionado] = useState(null)

    function renderVista(){

        switch(vista){
        
        case "mascotas":
            return (
                <Mascotas
                    user={user}
                    setVista={setVista}
                    setPacienteSeleccionado={setPacienteSeleccionado}
                />
            )

        case "fichaMascota":
        return (
            <FichaMascota
            pacienteId={pacienteSeleccionado}
            setVista={setVista}
            />
        )  

        case "historial":
            return <Historial user={user} />

        case "vacunas":
            return <Vacunas user={user} />

        default:
            return (
            <div className="dashboard">
                <h2>Bienvenido al Portal de Mascotas</h2>
                <p>Seleccioná una opción del menú para comenzar.</p>
            </div>
            )
        }
    }

    return (

        <div className="app-container">

        {/* SIDEBAR */}

        <div className="sidebar">

            <div className="logo-container">
            <img src={logo}/>
            </div>

            <p className="brand-name">
            La Banda Mascotera
            </p>

            <button onClick={()=>setVista("inicio")}>
            Inicio
            </button>

            <button onClick={()=>setVista("mascotas")}>
            Mis Mascotas
            </button>

            <button onClick={()=>setVista("historial")}>
            Historial
            </button>

            <button onClick={()=>setVista("vacunas")}>
            Vacunas
            </button>

            <button onClick={logout}>
            Cerrar sesión
            </button>

        </div>


        {/* MAIN */}

        <div className="main">

            {/* HEADER (esto es lo que te faltaba) */}

            <div className="header">
    <img src={logo} className="header-logo" />

            <div className="header-text">
                <h2>La Banda Mascotera</h2>
                <span>Portal de Mascotas</span>
            </div>
            </div>


            {/* CONTENT */}

            <div className="content">
            {renderVista()}
            </div>

            {/* MENU MOBILE */}

            <div className="mobile-nav">

                <button onClick={()=>setVista("inicio")}>
                    🏠
                    <span>Inicio</span>
                </button>

                <button onClick={()=>setVista("mascotas")}>
                🐶
                <span>Mascotas</span>
                </button>

                <button onClick={()=>setVista("historial")}>
                📋
                <span>Historial</span>
                </button>

                <button onClick={()=>setVista("vacunas")}>
                💉
                <span>Vacunas</span>
                </button>

                <button onClick={logout}>
                🚪
                <span>Salir</span>
                </button>

                </div>

            </div>

        </div>

    )
    }   