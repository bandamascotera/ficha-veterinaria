import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function Vacunas({ user }) {

  const [vacunas,setVacunas] = useState([])

  useEffect(()=>{
    cargarVacunas()
  },[])

  async function cargarVacunas(){

    // buscar propietario
    const { data: propietario } = await supabase
      .from("propietarios")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if(!propietario) return

    // buscar mascotas
    const { data: mascotas } = await supabase
      .from("pacientes")
      .select("id")
      .eq("propietario_id", propietario.id)

    if(!mascotas || mascotas.length === 0){
      setVacunas([])
      return
    }

    const ids = mascotas.map(m => m.id)

    // traer vacunas aplicadas
    const { data } = await supabase
      .from("vacunas_aplicadas")
      .select(`
        fecha_aplicacion,
        pacientes(nombre, especie),
        tipos_vacunas(
          nombre,
          frecuencia_meses
        )
      `)
      .in("paciente_id", ids)
      .order("fecha_aplicacion",{ascending:false})

    setVacunas(data || [])
  }

  function iconoMascota(especie){

    if(!especie) return "🐾"

    const e = especie.toLowerCase()

    if(e.includes("gato")) return "🐱"
    if(e.includes("perro")) return "🐶"

    return "🐾"
  }

  function calcularRefuerzo(fecha, meses){

    if(!fecha || !meses) return null

    const f = new Date(fecha)
    f.setMonth(f.getMonth() + meses)

    return f

  }

  function estadoVacuna(refuerzo){

    if(!refuerzo) return "ok"

    const hoy = new Date()
    const diff = (refuerzo - hoy) / (1000*60*60*24)

    if(diff < 0) return "vencida"
    if(diff < 30) return "proxima"

    return "ok"

  }

  return(

    <div>

      <h2>Vacunas</h2>

      <br/>

      {vacunas.map((v,i) => {

        const vacuna = v.tipos_vacunas
        const refuerzo = calcularRefuerzo(v.fecha_aplicacion, vacuna?.frecuencia_meses)
        const estado = estadoVacuna(refuerzo)

        return(

        <div
          key={i}
          className="paciente-card"
          style={{
            borderLeft:
              estado === "ok"
                ? "6px solid #4CAF50"
                : estado === "proxima"
                ? "6px solid #FFC107"
                : "6px solid #F44336"
          }}
        >

          <div className="paciente-nombre">
            {iconoMascota(v.pacientes?.especie)} {v.pacientes?.nombre}
          </div>

          <div className="historial-motivo">
            💉 {vacuna?.nombre}
          </div>

          <div className="historial-fecha">
            Aplicada: {new Date(v.fecha_aplicacion).toLocaleDateString()}
          </div>

          {refuerzo && (
            <div className="historial-tratamiento">
              Refuerzo: {refuerzo.toLocaleDateString()}
            </div>
          )}

        </div>

        )

      })}

      {vacunas.length === 0 && (
        <p>No hay vacunas registradas.</p>
      )}

    </div>

  )
}