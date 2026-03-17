import { useEffect, useState, useRef } from "react"
import { supabase } from "./supabaseClient"


export default function Pacientes({ setVista, setPacienteSeleccionado }) {

  const [pacientes, setPacientes] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [propietarios, setPropietarios] = useState([])
  const formRef = useRef(null)
  const [pacienteEditando, setPacienteEditando] = useState(null)
  const [form, setForm] = useState({
  nombre: "",
  especie: "",
  raza: "",
  sexo: "",
  anio_nacimiento: "",
  color: "",
  propietario_id: "",
  observaciones: ""
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
    anio_nacimiento: "",
    color: "",
    propietario_id: "",
    observaciones: ""
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
    anio_nacimiento: p.anio_nacimiento || "",
    color: p.color || "",
    propietario_id: p.propietario_id || "",
    observaciones: p.observaciones || ""
  })

  formRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start"
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

      <div ref={formRef}>
      <input name="nombre" placeholder="Nombre" onChange={handleChange} value={form.nombre}/>
      <br/><br/>

      <input name="especie" placeholder="Especie" onChange={handleChange} value={form.especie}/>
      <br/><br/>

      <input name="raza" placeholder="Raza" onChange={handleChange} value={form.raza}/>
      <br/><br/>

      <input name="sexo" placeholder="Sexo" onChange={handleChange} value={form.sexo}/>
      <br/><br/>

      <input 
          name="anio_nacimiento"
          placeholder="Año de nacimiento (ej: 2020)"
          onChange={handleChange}
          value={form.anio_nacimiento}
      />
      <br/><br/>

      <input name="color" placeholder="Color" onChange={handleChange} value={form.color}/>
      <br/><br/>

      <textarea
        name="observaciones"
        placeholder="Observaciones (ej: castrado, alergias, etc)"
        onChange={handleChange}
        value={form.observaciones}
      />
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

      <br/><br/>
      <hr/>
      </div>

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