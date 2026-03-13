import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function Mascotas({ user, setVista, setPacienteSeleccionado }) {

  const [mascotas, setMascotas] = useState([])

  function verFicha(mascota){
    setPacienteSeleccionado(mascota.id)
    setVista("fichaMascota")
  }

  useEffect(() => {
    cargarMascotas()
  }, [])

  async function cargarMascotas(){

    // buscar propietario asociado al usuario
    const { data: propietario } = await supabase
      .from("propietarios")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!propietario) return

    // buscar mascotas
    const { data } = await supabase
      .from("pacientes")
      .select("*")
      .eq("propietario_id", propietario.id)
      .order("nombre")

    setMascotas(data || [])

  }

  return (
    <div>

      <h2>Mis Mascotas</h2>

      <br/>

      {mascotas.map(m => (

        <div key={m.id} className="paciente-card">

          <div className="paciente-nombre">
            🐾 {m.nombre}
          </div>

          {m.foto_url && (

                <img
                    src={m.foto_url}
                    style={{
                    width:"80px",
                    height:"80px",
                    objectFit:"cover",
                    borderRadius:"10px",
                    marginBottom:"10px"
                    }}
                />

                )}

          <div className="paciente-prop">
            {m.especie} • {m.raza}
          </div>

          <div className="paciente-prop">
            Nacimiento: {m.fecha_nacimiento || "No registrado"}
          </div>

          <div className="paciente-prop">
            Color: {m.color || "No registrado"}
          </div>

          <div className="paciente-botones">

            <button
                className="btn-ficha"
                onClick={() => verFicha(m)}
            >
                Ver ficha
            </button>

            </div>

        </div>

      ))}

      {mascotas.length === 0 && (
        <p>No hay mascotas registradas.</p>
      )}

    </div>
  )
}