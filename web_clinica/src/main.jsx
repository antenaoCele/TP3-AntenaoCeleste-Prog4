import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider, AuthPage } from './Auth.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './Layout.jsx'
import { Usuarios } from './Usuarios.jsx'
import { DetallesUsuarios } from "./DetallesUsuario.jsx";
import { CrearUsuario } from "./CrearUsuario.jsx";
import { ModificarUsuario } from "./ModificarUsuarios.jsx";
import { Home } from './Home.jsx'
import "@picocss/pico"
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="usuarios"
              element={
                <AuthPage>
                  <Usuarios />
                </AuthPage>
              }
            />
            <Route
              path="usuarios/:id"
              element={
                <AuthPage>
                  <DetallesUsuarios />
                </AuthPage>
              }
            />
            <Route
              path="usuarios/:id/modificar"
              element={
                <AuthPage>
                  <ModificarUsuario />
                </AuthPage>
              }
            />
            <Route
              path="usuarios/crear"
              element={
                <AuthPage>
                  <CrearUsuario />
                </AuthPage>
              }
            />
          </Route>



        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode >
)
