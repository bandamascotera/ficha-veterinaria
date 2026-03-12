import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"


export default function Pacientes({ setVista, setPacienteSeleccionado }) {

  const [pacientes, setPacientes] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [propietarios, setPropietarios] = useState([])
  const [pacienteEditando, setPacienteEditando] = useState(null)
  const [form, setForm] = useState({
  nombre: "",
  especie: "",
  raza: "",
  sexo: "",
  fecha_nacimiento: "",
  color: "",
  propietario_id: ""
  })
  const pacientesFiltrados = pacientes.filter(p =>
  p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
  p.propietarios?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  useEffect(() => {
    cargarPacientes()
    cargarPropietarios()
  }, [])

  async function cargarPacientes() {
    const { data } = await supabase
      .from("pacientes")
      .select("*, propietarios(nombre)")
      .order("nombre")

    setPacientes(data || [])
  }

  async function cargarPropietarios() {
    const { data } = await supabase
      .from("propietarios")
      .select("id, nombre")
      .order("nombre")

    setPropietarios(data || [])
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function guardar() {
  if (pacienteEditando) {
    await supabase
      .from("pacientes")
      .update(form)
      .eq("id", pacienteEditando)
  } else {
  await supabase
      .from("pacientes")
      .insert([form])
      }

  setPacienteEditando(null)
  setForm({
    nombre: "",
    especie: "",
    raza: "",
    sexo: "",
    fecha_nacimiento: "",
    color: "",
    propietario_id: ""
  })

  cargarPacientes()
}

  function editarPaciente(p) {
  setPacienteEditando(p.id)
  setForm({
    nombre: p.nombre || "",
    especie: p.especie || "",
    raza: p.raza || "",
    sexo: p.sexo || "",
    fecha_nacimiento: p.fecha_nacimiento || "",
    color: p.color || "",
    propietario_id: p.propietario_id || ""
  })
}

  function verFicha(paciente) {
    setPacienteSeleccionado(paciente.id)
    setVista("ficha")
  }

  return (
    <div>
      <h2>Pacientes</h2>

      <input
        className="buscador"
        placeholder="🔎 Buscar paciente o propietario"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <br/><br/>

      <input name="nombre" placeholder="Nombre" onChange={handleChange} value={form.nombre}/>
      <br/><br/>

      <input name="especie" placeholder="Especie" onChange={handleChange} value={form.especie}/>
      <br/><br/>

      <input name="raza" placeholder="Raza" onChange={handleChange} value={form.raza}/>
      <br/><br/>

      <input name="sexo" placeholder="Sexo" onChange={handleChange} value={form.sexo}/>
      <br/><br/>

      <label>Fecha de nacimiento</label>
      <br/>
      <input type="date" name="fecha_nacimiento" onChange={handleChange} value={form.fecha_nacimiento}/>
      <br/><br/>

      <input name="color" placeholder="Color" onChange={handleChange} value={form.color}/>
      <br/><br/>

      <select name="propietario_id" onChange={handleChange} value={form.propietario_id}>
        <option value="">Seleccionar propietario</option>
        {propietarios.map(p => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>

      <br/><br/>

      <button onClick={guardar}>
        {pacienteEditando ? "Actualizar Paciente" : "Guardar Paciente"}
      </button>

      <hr/>

      {pacientesFiltrados.map(p => (

          <div key={p.id} className="paciente-card">

              <div className="paciente-nombre">
              {p.especie?.toLowerCase().includes("gato") ? "🐱" : "🐶"} {p.nombre}
              </div>

              <div className="paciente-prop">
              Propietario: {p.propietarios?.nombre || "Sin propietario"}
              </div>

              <div className="paciente-botones">

                  <button
                    className="btn-ficha"
                    onClick={() => verFicha(p)}
                  >
                    Ver ficha
                  </button>

                  <button
                    className="btn-editar"
                    onClick={() => editarPaciente(p)}
                  >
                    Editar
                  </button>

              </div>

          </div>

          ))}
    </div>
  )
}