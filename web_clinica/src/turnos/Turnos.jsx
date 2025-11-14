import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth";

export const Turnos = () => {
    const { fetchAuth } = useAuth();
    const [turnos, setTurnos] = useState([]);

    useEffect(() => {
        const fetchTurnos = async () => {

            const response = await fetchAuth("http://localhost:4000/turnos");
            const data = await response.json();

            if (!response.ok || !data.success) {
                console.log("Error al obtener turnos:", data.message);
                setTurnos([]);
                return;
            }

            setTurnos(data.data);
        };

        fetchTurnos();
    }, [fetchAuth]);

    return (
        <article>
            <h2>Turnos</h2>

            <Link to="/turnos/crear" role="button">
                Crear Turno
            </Link>

            {turnos.length === 0 ? (
                <p>No hay turnos cargados.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Médico</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {turnos.map((t) => (
                            <tr key={t.id}>
                                <td>
                                    {t.paciente_nombre} {t.paciente_apellido}
                                </td>
                                <td>
                                    {t.medico_nombre} {t.medico_apellido} ({t.especialidad})
                                </td>
                                <td>{t.fecha}</td>
                                <td>{t.hora}</td>
                                <td>{t.estado}</td>
                                <td>
                                    <Link to={`/turnos/${t.id}`} className="secondary">
                                        Ver
                                    </Link>{" "}
                                    <Link to={`/turnos/editar/${t.id}`} className="secondary">
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </article>
    );
};
