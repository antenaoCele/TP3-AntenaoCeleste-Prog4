import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider, AuthPage } from './Auth.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './Layout.jsx'
import { Usuarios } from './usuarios/Usuarios.jsx'
import { DetallesUsuarios } from "./usuarios/DetallesUsuario.jsx";
import { CrearUsuario } from "./usuarios/CrearUsuario.jsx";
import { ModificarUsuario } from "./usuarios/ModificarUsuarios.jsx";
import { CrearPaciente } from "./pacientes/CrearPaciente.jsx";
import { DetallesPaciente } from "./pacientes/DetallesPaciente.jsx";
import { EditarPaciente } from "./pacientes/EditarPaciente.jsx";
import { Pacientes } from "./pacientes/Pacientes.jsx";
import { Medicos } from "./medicos/Medicos.jsx"
import { CrearMedico } from "./medicos/CrearMedico.jsx"
import { DetallesMedico } from "./medicos/DetallesMedico.jsx"
import { EditarMedico } from "./medicos/EditarMedico.jsx"
import { Turnos } from "./turnos/Turnos.jsx"
import { VerTurno } from "./turnos/VerTurno.jsx"
import { CrearTurno } from "./turnos/CrearTurno.jsx"
import { EditarTurno } from "./turnos/EditarTurno.jsx"
import { TurnosPorMedico } from "./turnos/TurnosPorMedico.jsx"
import { TurnosPorPaciente } from "./turnos/TurnosPorPaciente.jsx"

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

            {/* USUARIOS */}
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



            {/* PACIENTES */}
            <Route
              path="pacientes"
              element={
                <AuthPage>
                  <Pacientes />
                </AuthPage>
              }
            />

            <Route
              path="pacientes/crear"
              element={
                <AuthPage>
                  <CrearPaciente />
                </AuthPage>
              }
            />

            <Route
              path="pacientes/:id/modificar"
              element={
                <AuthPage>
                  <EditarPaciente />
                </AuthPage>
              }
            />

            <Route
              path="pacientes/:id"
              element={
                <AuthPage>
                  <DetallesPaciente />
                </AuthPage>
              }
            />


            {/* MEDICOS */}
            <Route
              path="medicos"
              element={
                <AuthPage>
                  <Medicos />
                </AuthPage>
              }
            />

            <Route
              path="medicos/:id"
              element={
                <AuthPage>
                  <DetallesMedico />
                </AuthPage>
              }
            />

            <Route
              path="medicos/crear"
              element={
                <AuthPage>
                  <CrearMedico />
                </AuthPage>
              }
            />

            <Route
              path="medicos/editar/:id"
              element={
                <AuthPage>
                  <EditarMedico />
                </AuthPage>
              }
            />

            {/* TURNOS */}
            <Route
              path="turnos"
              element={
                <AuthPage>
                  <Turnos />
                </AuthPage>
              }
            />
            <Route
              path="turnos/crear"
              element={
                <AuthPage>
                  <CrearTurno />
                </AuthPage>
              }
            />
            <Route
              path="turnos/:id"
              element={
                <AuthPage>
                  <VerTurno />
                </AuthPage>
              }
            />
            <Route
              path="turnos/editar/:id"
              element={
                <AuthPage>
                  <EditarTurno />
                </AuthPage>
              }
            />
            <Route
              path="pacientes/:id/turnos"
              element={
                <AuthPage>
                  <TurnosPorPaciente />
                </AuthPage>
              }
            />
            <Route
              path="medicos/:id/turnos"
              element={
                <AuthPage>
                  <TurnosPorMedico />
                </AuthPage>
              }
            />

          </Route>
        </Routes >
      </BrowserRouter >
    </AuthProvider >
  </StrictMode >
)
