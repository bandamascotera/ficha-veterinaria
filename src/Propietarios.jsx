import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function Propietarios() {

  const [propietarios, setPropietarios] = useState([])
  const [propietarioEditando, setPropietarioEditando] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [form, setForm] = useState({
    nombre: "",
    dni: "",
    telefono: "",
    direccion: "",
    email: "",
    notas: ""
  })
  const propietariosFiltrados = propietarios.filter(p =>
  p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
  p.dni?.toLowerCase().includes(busqueda.toLowerCase())
  )

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    const { data } = await supabase
      .from("propietarios")
      .select("*")
      .order("nombre")

    setPropietarios(data || [])
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function guardar() {

    if (propietarioEditando) {

      await supabase
        .from("propietarios")
        .update(form)
        .eq("id", propietarioEditando)

    } else {

      await supabase
        .from("propietarios")
        .insert([form])

    }

    setPropietarioEditando(null)

    setForm({
      nombre: "",
      dni: "",
      telefono: "",
      direccion: "",
      email: "",
      notas: ""
    })

    cargar()
  }

  function editarPropietario(p) {

    setPropietarioEditando(p.id)

    setForm({
      nombre: p.nombre || "",
      dni: p.dni || "",
      telefono: p.telefono || "",
      direccion: p.direccion || "",
      email: p.email || "",
      notas: p.notas || ""
    })

  }

  return (
    <div>

      <h2>Propietarios</h2>

      <input
        className="buscador"
        placeholder="🔎 Buscar por nombre o DNI"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <br/><br/>

      <input
        name="nombre"
        placeholder="Nombre"
        onChange={handleChange}
        value={form.nombre}
      />
      <br/><br/>

      <input
        name="dni"
        placeholder="DNI"
        onChange={handleChange}
        value={form.dni}
      />

      <br/><br/>

      <input
        name="telefono"
        placeholder="Teléfono"
        onChange={handleChange}
        value={form.telefono}
      />
      <br/><br/>

      <input
        name="direccion"
        placeholder="Dirección"
        onChange={handleChange}
        value={form.direccion}
      />
      <br/><br/>

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        value={form.email}
      />
      <br/><br/>

      <textarea
        name="notas"
        placeholder="Notas"
        onChange={handleChange}
        value={form.notas}
      />
      <br/><br/>

      <button onClick={guardar}>
        {propietarioEditando ? "Actualizar Propietario" : "Guardar Propietario"}
      </button>

      <hr/>

      {propietariosFiltrados.map(p => (

        <div className="card" key={p.id}>

              <h3>👤 {p.nombre}</h3>

              {p.dni && <p>DNI: {p.dni}</p>}

              <p>📞 Tel: {p.telefono}</p>

              <p>📍 {p.direccion}</p>

        <button
          className="btn-warning"
          onClick={() => editarPropietario(p)}
        >
          ✏️ EDITAR
        </button>

        </div>

      ))}

    </div>
  )
}