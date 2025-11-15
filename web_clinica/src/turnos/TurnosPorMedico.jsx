import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../Auth";

export function TurnosPorMedico() {
    const { id } = useParams();
    const { fetchAuth } = useAuth();
    const [turnos, setTurnos] = useState([]);
    const [medico, setMedico] = useState(null);

    useEffect(() => {
        const fetchTurnos = async () => {
            try {
                const response = await fetchAuth(`http://localhost:4000/turnos/medicos/${id}/turnos`);
                const data = await response.json();
                if (data.success) {
                    setTurnos(data.data || []);
                    if (data.data.length > 0) {
                        setMedico({ nombre: data.data[0].medico_nombre, apellido: data.data[0].medico_apellido });
                    }
                }
            } catch (error) {
                console.error("Error en turnos por medico:", error);
            }
        };
        fetchTurnos();
    }, [id, fetchAuth]);

    return (
        <div>
            <h2>Turnos de {medico ? `Dr. ${medico.nombre} ${medico.apellido}` : `Médico #${id}`}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Paciente</th>
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
                            <td>{t.paciente_nombre} {t.paciente_apellido}</td>
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
