import { supabase } from "./supabaseClient"
import { useEffect, useState, useRef } from "react"

export default function FichaPaciente({ pacienteId, setVista }) {

  const [datos, setDatos] = useState(null)
  const [consultas, setConsultas] = useState([])
  const [vacunasDisponibles,setVacunasDisponibles] = useState([])
  const [vacunasSeleccionadas,setVacunasSeleccionadas] = useState([])
  const [consultaEditando, setConsultaEditando] = useState(null)
  const formRef = useRef(null)

  const [nuevaConsulta, setNuevaConsulta] = useState({
    motivo: "",
    diagnostico: "",
    tratamiento: "",
    peso: "",
    observaciones: "",
    analisis_clinico: ""
  })

  useEffect(() => {
    if (pacienteId) {
      cargarDatos()
    }
  }, [pacienteId])

  useEffect(()=>{

  async function cargarVacunas(){

    const {data,error} = await supabase
      .from("tipos_vacunas")
      .select("*")

    if(!error){
      setVacunasDisponibles(data)
    }

  }

  cargarVacunas()

},[])

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

    // 🔹 Traer historial con vacunas
    const { data: historial } = await supabase
      .from("consultas")
      .select(`
        *,
        vacunas_aplicadas(
          fecha_aplicacion,
          tipos_vacunas(
            nombre,
            frecuencia_meses
          )
        )
      `)
      .eq("paciente_id", pacienteId)
      .order("fecha", { ascending: false })

    setConsultas(historial || [])
  }

async function guardarConsultaFicha() {

  if (!nuevaConsulta.motivo) {
    alert("El motivo es obligatorio")
    return
  }

  let data, error

  if (consultaEditando) {

    const res = await supabase
      .from("consultas")
      .update(nuevaConsulta)
      .eq("id", consultaEditando)
      .select()
      .single()

    data = res.data
    error = res.error

  } else {

    const res = await supabase
      .from("consultas")
      .insert([{
        ...nuevaConsulta,
        paciente_id: pacienteId
      }])
      .select()
      .single()

    data = res.data
    error = res.error
  }

  if (error) {
    alert(error.message)
    return
  }

  const consultaId = data.id

  // SOLO si es nueva consulta agrega vacunas
  if (!consultaEditando && vacunasSeleccionadas.length > 0) {

    const registros = vacunasSeleccionadas.map(vacunaId => ({
      paciente_id: pacienteId,
      consulta_id: consultaId,
      vacuna_id: vacunaId
    }))

    await supabase
      .from("vacunas_aplicadas")
      .insert(registros)
  }

  setConsultaEditando(null)

  setVacunasSeleccionadas([])

  setNuevaConsulta({
    motivo: "",
    diagnostico: "",
    tratamiento: "",
    peso: "",
    observaciones: "",
    analisis_clinico: ""
  })

  cargarDatos()
}

function editarConsulta(c) {

  setConsultaEditando(c.id)

  setNuevaConsulta({
    motivo: c.motivo || "",
    diagnostico: c.diagnostico || "",
    tratamiento: c.tratamiento || "",
    peso: c.peso || "",
    observaciones: c.observaciones || "",
    analisis_clinico: c.analisis_clinico || ""
  })

  formRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  })
}

  
function calcularEdad(anio){
  if(!anio) return "-"
  const hoy = new Date().getFullYear()
  return hoy - anio
}

  function calcularRefuerzo(fecha, meses){

    if(!fecha || !meses) return null

    const f = new Date(fecha)
    f.setMonth(f.getMonth() + meses)

    return f.toLocaleDateString()

  }

  if (!pacienteId) return <p>Seleccioná un paciente.</p>
  if (!datos) return <p>Cargando ficha...</p>

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>

      <button onClick={() => setVista("pacientes")}>
        ← Volver
      </button>

      <h2>Ficha Clínica</h2>

      <div style={{
        border: "1px solid #ccc",
        padding: 20,
        borderRadius: 10,
        marginBottom: 20
      }}>

        <h3>
        {datos.especie?.toLowerCase().includes("gato") ? "🐱" : "🐶"} {datos.nombre}
        </h3>

        <p><strong>Especie:</strong> {datos.especie}</p>
        <p><strong>Raza:</strong> {datos.raza}</p>
        <p><strong>Sexo:</strong> {datos.sexo}</p>
        <p><strong>Color:</strong> {datos.color}</p>
        {datos.observaciones && (
        <p><strong>Observaciones:</strong> {datos.observaciones}</p>
        )}
        
        <p><strong>Edad:</strong> {calcularEdad(datos.anio_nacimiento)} años</p>

        <hr />

        <h4>Propietario</h4>

        <p><strong>Nombre:</strong> {datos.propietario?.nombre}</p>
        <p><strong>Teléfono:</strong> {datos.propietario?.telefono}</p>
        <p><strong>Email:</strong> {datos.propietario?.email}</p>
        <p><strong>Dirección:</strong> {datos.propietario?.direccion}</p>

      </div>

      <div
        ref={formRef}
        style={{
          border: "1px solid #4CAF50",
          padding: 20,
          borderRadius: 10,
          marginBottom: 30,
          backgroundColor: "#f0fff4"
        }}
      >

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

      <textarea
          placeholder="Análisis Clínico"
          value={nuevaConsulta.analisis_clinico}
          onChange={(e) =>
            setNuevaConsulta({ ...nuevaConsulta, analisis_clinico: e.target.value })
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

<h4>Vacunas aplicadas</h4>

<select
onChange={(e)=>{

const vacunaId = e.target.value

if(!vacunaId) return
if(vacunasSeleccionadas.includes(vacunaId)) return

setVacunasSeleccionadas([
...vacunasSeleccionadas,
vacunaId
])

}}
>

<option value="">Seleccionar vacuna</option>

{vacunasDisponibles.map(v => (
<option key={v.id} value={v.id}>
{v.nombre}
</option>
))}

</select>

<div className="vacunas-lista">

{vacunasSeleccionadas.map(id => {

const vacuna = vacunasDisponibles.find(v=>v.id===id)

return (
<div key={id} className="vacuna-item">
💉 {vacuna?.nombre}

<button
onClick={() =>
setVacunasSeleccionadas(
vacunasSeleccionadas.filter(v => v !== id)
)
}
>
❌
</button>

</div>
)

})}

</div>

<button onClick={guardarConsultaFicha}>
  {consultaEditando ? "Actualizar Consulta" : "Guardar Consulta"}
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
<p style={{whiteSpace: "pre-line"}}>
  <strong>Observaciones:</strong> {c.observaciones}
</p>
<p style={{whiteSpace: "pre-line"}}>
  <strong>Análisis Clínico:</strong> {c.analisis_clinico}
</p>
<p><strong>Tratamiento:</strong> {c.tratamiento}</p>
<p><strong>Diagnóstico Presuntivo:</strong> {c.diagnostico}</p>

{c.vacunas_aplicadas?.length > 0 && (

<div style={{marginTop:10}}>

<strong>Vacunas aplicadas:</strong>

{c.vacunas_aplicadas.map((v,i)=>{

const vacuna = v.tipos_vacunas

return (

<div key={i}>

💉 {vacuna?.nombre}

<br/>

<small>

Aplicada: {new Date(v.fecha_aplicacion).toLocaleDateString()}

{vacuna?.frecuencia_meses && (
<>
{" "}• Refuerzo: {calcularRefuerzo(v.fecha_aplicacion, vacuna.frecuencia_meses)}
</>
)}

</small>


</div>

)

})}

</div>

)}

<button
  onClick={() => editarConsulta(c)}
  style={{ marginTop: 10 }}
>
  ✏️ Editar
</button>

</div>
))}

</div>
)
}