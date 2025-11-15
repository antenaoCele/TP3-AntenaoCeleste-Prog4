
import { useEffect, useState } from "react";
import { useAuth } from "../Auth";
import { Link } from "react-router-dom";

export const Medicos = () => {
    const { fetchAuth } = useAuth();
    const [medicos, setMedicos] = useState([]);


    useEffect(() => {
        const fetchMedicos = async () => {
            const response = await fetchAuth("http://localhost:4000/medicos");
            const data = await response.json();

            if (!response.ok || !data.success) {
                console.log("Error al obtener médicos:", data.message);
                setMedicos([]);
                return;
            }

            setMedicos(data.data);

        }
        fetchMedicos();
    }, [fetchAuth]);

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este medico?")) return;

        const response = await fetchAuth(`http://localhost:4000/medicos/${id}`, {
            method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            console.log("Error al eliminar:", data.message);
            return;
        }

        setMedicos(medicos.filter((m) => m.id !== id));
    };

    return (
        <article>
            <h2>Médicos</h2>

            {medicos.length === 0 ? (
                <p>No hay médicos cargados.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Especialidad</th>
                            <th>Matrícula</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicos.map((m) => (
                            <tr key={m.id}>
                                <td>{m.nombre}</td>
                                <td>{m.apellido}</td>
                                <td>{m.especialidad}</td>
                                <td>{m.matricula}</td>
                                <td>
                                    <Link to={`/medicos/${m.id}`} role="button" className="secondary">Ver</Link>{" "}
                                    <Link to={`/medicos/editar/${m.id}`} role="button" className="secondary">Modificar</Link>{" "}
                                    <Link
                                        to={`/medicos/${m.id}/turnos`}
                                        role="button"
                                        className="secondary"
                                    >
                                        Ver Turnos
                                    </Link>
                                    {" "}
                                    <button
                                        onClick={() => handleEliminar(m.id)}
                                        className="secondary"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}


                    </tbody>
                </table>

            )}
            <Link to="/medicos/crear" role="button">Agregar Médico</Link>
        </article>
    );
};
