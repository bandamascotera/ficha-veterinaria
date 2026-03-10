import { useState } from "react"
import { supabase } from "./supabaseClient"
import logo from "./assets/logo.png"

export default function Login({ setUser }) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleLogin(e) {

    e.preventDefault()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError("Usuario o contraseña incorrectos")
      return
    }

    setUser(data.user)
  }

  return (

    <div className="login-container">

      <div className="login-card">

        <img src={logo} className="login-logo"/>

        <h2>La Banda Mascotera</h2>
        <span>Sistema Clínico Veterinario</span>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button type="submit">
            Ingresar
          </button>

        </form>

        {error && <p className="login-error">{error}</p>}

      </div>

    </div>

  )
}