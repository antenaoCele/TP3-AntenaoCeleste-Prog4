import { useState } from "react";
import { Usuarios } from "./Usuarios.jsx";
import { useAuth } from "./Auth.jsx"

export default function App() {
  const { token, error, login, logout } = useAuth();
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(nombre, password)
  };

  return (
    <>
      <h1>LOGIN</h1>
      {!token && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombre">Usuario:</label>
          <input
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <label htmlFor="password">Contraseña:</label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Ingresar</button>
        </form>
      )}
      {token && (
        <>
          <h2>Usuarios</h2>
          <button onClick={() => logout()}>Salir</button>
          <Usuarios token={token} />
        </>
      )}
    </>
  );
}
