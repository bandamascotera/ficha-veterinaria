import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function FichaPaciente({ pacienteId }) {

  const [datos, setDatos] = useState(null)
  const [consultas, setConsultas] = useState([])

  const [nuevaConsulta, setNuevaConsulta] = useState({
    motivo: "",
    diagnostico: "",
    tratamiento: "",
    peso: "",
    observaciones: ""
  })

  useEffect(() => {
    if (pacienteId) {
      cargarDatos()
    }
  }, [pacienteId])

  async function cargarDatos() {

    // Traer paciente
    const { data: pacienteData, error } = await supabase
      .from("pacientes")
      .select("*")
      .eq("id", pacienteId)
      .single()

    if (error) {
      console.error(error)
      return
    }

    let propietarioData = null

    if (pacienteData.propietario_id) {
      const { data } = await supabase
        .from("propietarios")
        .select("*")
        .eq("id", pacienteData.propietario_id)
        .single()

      propietarioData = data
    }

    setDatos({
      ...pacienteData,
      propietario: propietarioData
    })

    // Traer historial
    const { data: historial } = await supabase
      .from("consultas")
      .select("*")
      .eq("paciente_id", pacienteId)
      .order("fecha", { ascending: false })

    setConsultas(historial || [])
  }

  async function guardarConsultaFicha() {

    if (!nuevaConsulta.motivo) {
      alert("El motivo es obligatorio")
      return
    }

    const { error } = await supabase
      .from("consultas")
      .insert([{
        ...nuevaConsulta,
        paciente_id: pacienteId
      }])

    if (error) {
      alert(error.message)
      return
    }

    setNuevaConsulta({
      motivo: "",
      diagnostico: "",
      tratamiento: "",
      peso: "",
      observaciones: ""
    })

    cargarDatos()
  }

  function calcularEdad(fecha) {
    if (!fecha) return "-"
    const nacimiento = new Date(fecha)
    const hoy = new Date()
    return hoy.getFullYear() - nacimiento.getFullYear()
  }

  if (!pacienteId) return <p>Seleccioná un paciente.</p>
  if (!datos) return <p>Cargando ficha...</p>

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>

      <button onClick={() => window.location.reload()}>
        ← Volver
      </button>

      <h2>Ficha Clínica</h2>

      <div style={{
        border: "1px solid #ccc",
        padding: 20,
        borderRadius: 10,
        marginBottom: 20
      }}>

        <h3>{datos.nombre}</h3>

        <p><strong>Especie:</strong> {datos.especie}</p>
        <p><strong>Raza:</strong> {datos.raza}</p>
        <p><strong>Sexo:</strong> {datos.sexo}</p>
        <p><strong>Color:</strong> {datos.color}</p>
        <p><strong>Edad:</strong> {calcularEdad(datos.fecha_nacimiento)} años</p>

        <hr />

        <h4>Propietario</h4>

        <p><strong>Nombre:</strong> {datos.propietario?.nombre}</p>
        <p><strong>Teléfono:</strong> {datos.propietario?.telefono}</p>
        <p><strong>Email:</strong> {datos.propietario?.email}</p>
        <p><strong>Dirección:</strong> {datos.propietario?.direccion}</p>

      </div>

      <div style={{
        border: "1px solid #4CAF50",
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
        backgroundColor: "#f0fff4"
      }}>

        <h3>Nueva Consulta</h3>

        <input
  placeholder="Peso actual (kg)"
  value={nuevaConsulta.peso}
  onChange={(e) =>
    setNuevaConsulta({ ...nuevaConsulta, peso: e.target.value })
  }
/>

<br/><br/>

      <input
        placeholder="Motivo de consulta"
        value={nuevaConsulta.motivo}
        onChange={(e) =>
          setNuevaConsulta({ ...nuevaConsulta, motivo: e.target.value })
        }
      />

      <br/><br/>

      <textarea
        placeholder="Observaciones"
        value={nuevaConsulta.observaciones}
        onChange={(e) =>
          setNuevaConsulta({ ...nuevaConsulta, observaciones: e.target.value })
        }
      />

      <br/><br/>

      <input
        placeholder="Tratamiento"
        value={nuevaConsulta.tratamiento}
        onChange={(e) =>
          setNuevaConsulta({ ...nuevaConsulta, tratamiento: e.target.value })
        }
      />

      <br/><br/>

      <input
        placeholder="Diagnóstico Presuntivo"
        value={nuevaConsulta.diagnostico}
        onChange={(e) =>
          setNuevaConsulta({ ...nuevaConsulta, diagnostico: e.target.value })
        }
      />
        <br/><br/>

        <button onClick={guardarConsultaFicha}>
          Guardar Consulta
        </button>

      </div>

      <h3>Historial de Consultas</h3>

      {consultas.length === 0 && <p>No tiene consultas registradas.</p>}

      {consultas.map(c => (
        <div key={c.id} style={{
          border: "1px solid #ddd",
          padding: 15,
          marginBottom: 10,
          borderRadius: 8,
          backgroundColor: "#f9f9f9"
        }}>

          <p><strong>Fecha:</strong> {new Date(c.fecha).toLocaleDateString()}</p>
          <p><strong>Peso:</strong> {c.peso} kg</p>
          <p><strong>Motivo de consulta:</strong> {c.motivo}</p>
          <p><strong>Observaciones:</strong> {c.observaciones}</p>
          <p><strong>Tratamiento:</strong> {c.tratamiento}</p>
          <p><strong>Diagnóstico Presuntivo:</strong> {c.diagnostico}</p>

        </div>
      ))}

    </div>
  )
}