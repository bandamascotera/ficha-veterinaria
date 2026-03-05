import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function Consultas() {

  const [pacientes, setPacientes] = useState([])

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

    const { error } = await supabase
      .from('consultas')
      .insert([form])

    if (error)
      alert(error.message)
    else {
      alert("Consulta guardada correctamente")
      limpiarFormulario()
    }
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

      <br/><br/>

      <button onClick={guardarConsulta}>
        Guardar Consulta
      </button>

    </div>
  )
}