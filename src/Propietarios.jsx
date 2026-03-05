import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function Propietarios() {

  const [propietarios, setPropietarios] = useState([])
  const [propietarioEditando, setPropietarioEditando] = useState(null)

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    email: "",
    notas: ""
  })

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
        name="nombre"
        placeholder="Nombre"
        onChange={handleChange}
        value={form.nombre}
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

      {propietarios.map(p => (

        <div key={p.id} style={{ marginBottom: 10 }}>

          <strong>{p.nombre}</strong> - {p.telefono}

          <button
            style={{ marginLeft: 10 }}
            onClick={() => editarPropietario(p)}
          >
            Editar
          </button>

        </div>

      ))}

    </div>
  )
}