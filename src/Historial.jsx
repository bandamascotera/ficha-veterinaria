import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function Historial({ user }) {

  const [consultas,setConsultas] = useState([])

  useEffect(()=>{
    cargarHistorial()
  },[])

  async function cargarHistorial(){

    // 1 buscar propietario
    const { data: propietario } = await supabase
      .from("propietarios")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if(!propietario) return

    // 2 buscar mascotas
    const { data: mascotas } = await supabase
      .from("pacientes")
      .select("id")
      .eq("propietario_id", propietario.id)

    if(!mascotas || mascotas.length === 0){
      setConsultas([])
      return
    }

    const ids = mascotas.map(m => m.id)

    // 3 traer consultas
    const { data } = await supabase
      .from("consultas")
      .select(`
        *,
        pacientes(nombre, especie)
      `)
      .in("paciente_id", ids)
      .order("fecha",{ascending:false})

    setConsultas(data || [])
  }

  function iconoMascota(especie){

    if(!especie) return "🐾"

    const e = especie.toLowerCase()

    if(e.includes("gato")) return "🐱"
    if(e.includes("perro")) return "🐶"

    return "🐾"
  }

  return(

    <div>

      <h2>Historial Veterinario</h2>

      <br/>

      {consultas.map(c =>(

        <div key={c.id} className="paciente-card">

          <div className="paciente-nombre">
            {iconoMascota(c.pacientes?.especie)} {c.pacientes?.nombre}
          </div>

          <div className="historial-fecha">
            📅 {new Date(c.fecha).toLocaleDateString()}
          </div>

          <div className="historial-motivo">
            {c.motivo}
          </div>

          {c.tratamiento && (
            <div className="historial-tratamiento">
              Tratamiento: {c.tratamiento}
            </div>
          )}

        </div>

      ))}

      {consultas.length === 0 && (
        <p>No hay consultas registradas.</p>
      )}

    </div>

  )
}