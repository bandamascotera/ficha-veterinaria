import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function Cuenta({ user, logout }) {

  const [propietario,setPropietario] = useState(null)
  const [password,setPassword] = useState("")
  const [mensaje,setMensaje] = useState("")

  useEffect(()=>{
    cargarCuenta()
  },[])

  async function cargarCuenta(){

    const { data } = await supabase
      .from("propietarios")
      .select("*")
      .eq("user_id", user.id)
      .single()

    setPropietario(data)
  }

  async function cambiarPassword(){

    if(password.length < 6){
      setMensaje("La contraseña debe tener al menos 6 caracteres")
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if(error){
      setMensaje("Error al cambiar la contraseña")
    }else{
      setMensaje("Contraseña actualizada correctamente")
      setPassword("")
    }

  }

  return(

    <div>

      <h2>Mi Cuenta</h2>

      <br/>

      {propietario && (

        <div className="paciente-card">

          <div className="paciente-nombre">
            👤 {propietario.nombre}
          </div>

          <div className="historial-motivo">
            📞 Teléfono: {propietario.telefono}
          </div>

          <div className="historial-motivo">
            ✉️ Email: {propietario.email}
          </div>

          {propietario.dni && (
            <div className="historial-motivo">
              🪪 DNI: {propietario.dni}
            </div>
          )}

        </div>

      )}

      <br/>

      <div className="paciente-card">

        <h3>Cambiar contraseña</h3>

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <br/><br/>

        <button onClick={cambiarPassword}>
          Actualizar contraseña
        </button>

        {mensaje && (
          <p>{mensaje}</p>
        )}

      </div>

      <br/>

      <div className="paciente-card">

        <h3>Modificar datos</h3>

        <p>
          Para modificar datos personales comuníquese con administración.
        </p>

        <p>
          <strong>La Banda Mascotera</strong>
        </p>

        <p>
          📞 221 5114651
        </p>

      </div>

      <br/>

      <button onClick={logout}>
        🚪 Cerrar sesión
      </button>

    </div>

  )
}