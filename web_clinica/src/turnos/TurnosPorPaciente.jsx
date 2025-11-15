import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../Auth";

export function TurnosPorPaciente() {
    const { id } = useParams();
    const { fetchAuth } = useAuth();
    const [turnos, setTurnos] = useState([]);
    const [paciente, setPaciente] = useState(null);

    useEffect(() => {
        const fetchTurnos = async () => {
            try {
                const response = await fetchAuth(`http://localhost:4000/turnos/pacientes/${id}/turnos`);
                const data = await response.json();
                if (data.success) {
                    setTurnos(data.data || []);
                    if (data.data.length > 0) {
                        setPaciente({ nombre: data.data[0].paciente_nombre, apellido: data.data[0].paciente_apellido });
                    }
                }
            } catch (error) {
                console.error("Error en turnos por paciente:", error);
            }
        };
        fetchTurnos();
    }, [id, fetchAuth]);

    return (
        <div>
            <h2>Turnos de {paciente ? `${paciente.nombre} ${paciente.apellido}` : `Paciente #${id}`}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Doctor</th>
                        <th>Estado</th>
                        <th>Observaciones</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {turnos.map(t => (
                        <tr key={t.id}>
                            <td>{t.fecha.slice(0, 10)}</td>
                            <td>{t.hora}</td>
                            <td>Dr. {t.medico_nombre} {t.medico_apellido}</td>
                            <td>{t.estado}</td>
                            <td>{t.observaciones}</td>
                            <td><Link to={`/turnos/${t.id}`} role="button" className="secondary">Ver</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
