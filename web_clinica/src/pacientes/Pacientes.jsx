import { useEffect, useState } from "react";
import { useAuth } from "../Auth";
import { Link } from "react-router-dom";

export const Pacientes = () => {
    const { fetchAuth } = useAuth();
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
        const fetchPacientes = async () => {
            const response = await fetchAuth("http://localhost:4000/pacientes");
            const data = await response.json();

            if (!response.ok || !data.success) {
                console.log("Error:", data.error);
                return;
            }

            setPacientes(data.data);
        };

        fetchPacientes();
    }, [fetchAuth]);

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este paciente?")) return;

        const response = await fetchAuth(`http://localhost:4000/pacientes/${id}`, {
            method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            console.log("Error al eliminar:", data.error);
            return;
        }

        setPacientes(pacientes.filter((p) => p.id !== id));
    };

    return (
        <article>
            <h2>Pacientes</h2>

            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>DNI</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pacientes.map((p) => (
                        <tr key={p.id}>
                            <td>
                                {p.nombre}
                            </td>
                            <td>
                                {p.apellido}
                            </td>
                            <td>{p.DNI}</td>
                            <td>
                                <Link
                                    to={`/pacientes/${p.id}`}
                                    role="button"
                                    className="secondary">Ver</Link>{" "}
                                <Link
                                    to={`/pacientes/${p.id}/modificar`}
                                    role="button"
                                    className="secondary"
                                >
                                    Modificar
                                </Link>{" "}
                                <button
                                    onClick={() => handleEliminar(p.id)}
                                    className="secondary"
                                >
                                    Eliminar
                                </button>{" "}
                                <Link
                                    to={`/pacientes/${p.id}/turnos`}
                                    role="button"
                                    className="secondary"
                                >
                                    Ver Turnos
                                </Link>


                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/pacientes/crear" role="button">Agregar Paciente</Link>

        </article>
    );
};
