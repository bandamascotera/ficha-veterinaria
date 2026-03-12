import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function Consultas() {

  const [pacientes, setPacientes] = useState([])
  const [vacunasDisponibles,setVacunasDisponibles] = useState([])
  const [vacunasSeleccionadas,setVacunasSeleccionadas] = useState([])

  const [form, setForm] = useState({
    paciente_id: '',
    motivo: '',
    diagnostico: '',
    tratamiento: '',
    peso: '',
    observaciones: ''
  })

  useEffect(() => {
    cargarPacientes()
  }, [])

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

  async function cargarPacientes() {

    const { data, error } = await supabase
      .from('pacientes')
      .select('id, nombre')
      .order('nombre')

    if (!error)
      setPacientes(data)
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function guardarConsulta() {

  if (!form.paciente_id) {
    alert("Seleccionar paciente")
    return
  }

  const { data, error } = await supabase
    .from("consultas")
    .insert([form])
    .select()
    .single()

  if (error){
    alert(error.message)
    return
  }

  const consultaId = data.id

  // guardar vacunas aplicadas
  if(vacunasSeleccionadas.length > 0){

    const registros = vacunasSeleccionadas.map(vacunaId => ({
      paciente_id: form.paciente_id,
      consulta_id: consultaId,
      vacuna_id: vacunaId
    }))

    const { error: errorVacunas } = await supabase
      .from("vacunas_aplicadas")
      .insert(registros)

    if(errorVacunas){
      console.error(errorVacunas)
    }

  }

  alert("Consulta guardada correctamente")

  setVacunasSeleccionadas([])

  limpiarFormulario()

}

  function limpiarFormulario() {
    setForm({
      paciente_id: '',
      motivo: '',
      diagnostico: '',
      tratamiento: '',
      peso: '',
      observaciones: ''
    })
  }

  return (
    <div style={{ padding: 20, maxWidth: 500 }}>

      <h2>Nueva Consulta Veterinaria</h2>

      <select name="paciente_id" onChange={handleChange} value={form.paciente_id}>

        <option value="">Seleccionar paciente</option>

        {pacientes.map(p => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}

      </select>

      <br/><br/>

      <input
  name="peso"
  placeholder="Peso actual (kg)"
  onChange={handleChange}
  value={form.peso}
/>

<br/><br/>

        <input
          name="motivo"
          placeholder="Motivo de consulta"
          onChange={handleChange}
          value={form.motivo}
        />

        <br/><br/>

        <textarea
          name="observaciones"
          placeholder="Observaciones clínicas"
          onChange={handleChange}
          value={form.observaciones}
        />

        <br/><br/>

        <input
          name="tratamiento"
          placeholder="Tratamiento indicado"
          onChange={handleChange}
          value={form.tratamiento}
        />

        <br/><br/>

        <input
          name="diagnostico"
          placeholder="Diagnóstico presuntivo"
          onChange={handleChange}
          value={form.diagnostico}
        />

        <h4>Vacunas aplicadas</h4>

          <select
          className="vacunas-select"
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
              className="vacuna-remove"
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

      <br/><br/>

      <button onClick={guardarConsulta}>
        Guardar Consulta
      </button>

    </div>
  )
}