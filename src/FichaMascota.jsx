import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function FichaMascota({ pacienteId, setVista }) {

  const [mascota,setMascota] = useState(null)
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({})
  const [consultas, setConsultas] = useState([])

  function calcularEdad(anio){
  if(!anio) return "No registrada"

  const actual = new Date().getFullYear()
  return `${actual - anio} años`
}

  function calcularRefuerzo(fecha, meses){

        if(!fecha || !meses) return null

        const f = new Date(fecha)
        f.setMonth(f.getMonth() + meses)

        return f.toLocaleDateString()

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

        //console.log("CONSULTAS:", historial)
        setConsultas(historial || [])

  }

  async function guardarCambios(){

  const { error } = await supabase
    .from("pacientes")
    .update({
      nombre: form.nombre,
      raza: form.raza,
      color: form.color,
      anio_nacimiento: form.anio_nacimiento
    })
    .eq("id", mascota.id)

  if(error){
    alert(error.message)
    return
  }

  setMascota(form)
  setEditando(false)

}

async function subirFoto(e){

  const file = e.target.files[0]
  if(!file) return

  const fileName = `${mascota.id}-${Date.now()}`

  const { error } = await supabase
    .storage
    .from("mascotas")
    .upload(fileName, file)

  if(error){
    alert(error.message)
    return
  }

  const { data } = supabase
    .storage
    .from("mascotas")
    .getPublicUrl(fileName)

  const url = data.publicUrl

  const { error: updateError } = await supabase
    .from("pacientes")
    .update({ foto_url: url })
    .eq("id", mascota.id)

  if(updateError){
    alert(updateError.message)
    return
  }

  setMascota({
    ...mascota,
    foto_url: url
  })

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

      <div style={{marginTop:"20px"}}>

            {mascota.foto_url ? (

                <img
                src={mascota.foto_url}
                style={{
                    width:"150px",
                    height:"150px",
                    objectFit:"cover",
                    borderRadius:"12px"
                }}
                />

            ) : (

                <div style={{
                width:"150px",
                height:"150px",
                background:"#eee",
                borderRadius:"12px",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                fontSize:"40px"
                }}>
                <strong>Foto</strong>
                </div>

            )}

            <br/><br/>
            
            {editando && (

                <div style={{marginTop:"10px"}}>

                    <div style={{marginBottom:"5px", fontWeight:"bold"}}>
                    📷 Subir foto
                    </div>

                    <input
                    type="file"
                    accept="image/*"
                    onChange={subirFoto}
                    />

                </div>

                )}

            </div>

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
            <strong>Edad:</strong> {calcularEdad(mascota.anio_nacimiento)}
            </div>

            <div className="paciente-prop">
            <strong>Peso:</strong> {
            consultas.length > 0
                ? `${consultas[0].peso} kg`
                : "No registrado"
            }
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
            {mascota.observaciones || "No hay notas registradas."}
            </p>

        </div>

        <div className="paciente-card">

    <h3>Historial veterinario</h3>

    {consultas.length === 0 && (
    <p>No hay consultas registradas.</p>
    )}

{consultas.map(c => (
  
  <div key={c.id} className="historial-item">

    <div className="historial-fecha">
      📅 {new Date(c.fecha).toLocaleDateString()}
    </div>

    <div className="historial-motivo">
    <strong>Motivo:</strong> {c.motivo}
    </div>

    {c.tratamiento && (
        <div className="historial-tratamiento">
            <strong>Tratamiento:</strong> {c.tratamiento}
        </div>
        )}

    {/* VACUNAS */}

    {c.vacunas_aplicadas?.length > 0 && (

      <div className="historial-vacunas">

        <strong>Vacunas aplicadas</strong>

        {c.vacunas_aplicadas.map((v,i)=>{

          const vacuna = v.tipos_vacunas

          return(

            <div key={i}>

              💉 {vacuna?.nombre}

              <br/>

              <small>

                Aplicada: {new Date(v.fecha_aplicacion).toLocaleDateString()}

                {vacuna?.frecuencia_meses && (
                  <>
                    {" "}• Refuerzo: {calcularRefuerzo(
                      v.fecha_aplicacion,
                      vacuna.frecuencia_meses
                    )}
                  </>
                )}

              </small>

            </div>

          )

        })}

      </div>

    )}

  </div>

))}

</div>

    </div>


  )
}