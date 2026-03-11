import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function FichaMascota({ pacienteId, setVista }) {

  const [mascota,setMascota] = useState(null)
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({})

  function calcularEdad(fecha){

    if(!fecha) return "No registrada"

    const hoy = new Date()
    const nacimiento = new Date(fecha)

    let años = hoy.getFullYear() - nacimiento.getFullYear()
    let meses = hoy.getMonth() - nacimiento.getMonth()

    if(meses < 0){
      años--
      meses += 12
    }

    if(años === 0){
      return `${meses} meses`
    }

    return `${años} años`
  }

  useEffect(() => {
    cargarMascota()
  }, [])

  async function cargarMascota(){

    const { data } = await supabase
      .from("pacientes")
      .select("*")
      .eq("id", pacienteId)
      .single()

    setMascota(data)
    setForm(data)
  }

  async function guardarCambios(){

  const { error } = await supabase
    .from("pacientes")
    .update({
      nombre: form.nombre,
      raza: form.raza,
      color: form.color,
      fecha_nacimiento: form.fecha_nacimiento
    })
    .eq("id", mascota.id)

  if(error){
    alert(error.message)
    return
  }

  setMascota(form)
  setEditando(false)

}

function cancelarEdicion(){

  setForm(mascota)   // volver a los datos originales
  setEditando(false)

}

  if(!mascota){
    return <p>Cargando ficha...</p>
  }

  return (

    <div>

      <button
        className="btn-volver"
        onClick={() => setVista("mascotas")}
        style={{marginRight:"10px"}}
      >
        ← Volver a Mascotas
      </button>

      <button
        onClick={()=>setEditando(true)}
    >
        ✏️ Editar datos
        </button>

      <div className="paciente-prop" style={{marginTop:"10px"}}>

            <strong>🐾 Nombre:</strong>

            {editando ? (

            <input
            value={form.nombre || ""}
            onChange={(e)=>setForm({...form,nombre:e.target.value})}
            style={{display:"block", marginTop:"5px"}}
            />

            ) : (

            mascota.nombre

            )}

            </div>

      <div className="paciente-card">

        <div className="paciente-prop">
          <strong>Especie:</strong> {mascota.especie || "No registrado"}
        </div>

        <div className="paciente-prop">
        <strong>Raza:</strong>

        {editando ? (

            <input
            value={form.raza || ""}
            onChange={(e)=>setForm({...form,raza:e.target.value})}
            />

        ) : (

            mascota.raza || "No registrado"

        )}

        </div>

        <div className="paciente-prop">
          <strong>Sexo:</strong> {mascota.sexo || "No registrado"}
        </div>

        <div className="paciente-prop">
        <strong>Color:</strong>

        {editando ? (

            <input
                value={form.color || ""}
                onChange={(e)=>setForm({...form,color:e.target.value})}
            />

        ) : (

            mascota.color || "No registrado"

        )}

        </div>

        <div className="paciente-prop">
            <strong>Nacimiento:</strong>

            {editando ? (

                <input
                type="date"
                value={form.fecha_nacimiento || ""}
                onChange={(e)=>setForm({...form,fecha_nacimiento:e.target.value})}
                />

            ) : (

                mascota.fecha_nacimiento || "No registrado"

            )}

            </div>

        <div className="paciente-prop">
          <strong>Edad:</strong> {calcularEdad(mascota.fecha_nacimiento)}
        </div>

        <div className="paciente-prop">
          <strong>Peso:</strong> {mascota.peso || "No registrado"}
        </div>

      </div>

      <br/>

      {editando && (
        <div style={{marginTop:"10px", marginBottom:"20px"}}>
        <button onClick={guardarCambios}
        style={{marginRight:"10px"}}>
            💾 Guardar cambios
        </button>
        <button onClick={cancelarEdicion}>
            ❌ Cancelar
        </button>
        </div>
       )}

       <div style={{marginTop:"15px", marginBottom:"35px"}}></div>


      <div className="paciente-card">

        <h3>Notas veterinarias</h3>

        <p>
          {mascota.notas || "No hay notas registradas."}
        </p>

      </div>

    </div>

  )
}