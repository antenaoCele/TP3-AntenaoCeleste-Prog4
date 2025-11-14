import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export function TurnosPorPaciente() {
    const { id } = useParams();
    const [turnos, setTurnos] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:4000/turnos/pacientes/${id}/turnos`)
            .then(res => res.json())
            .then(data => setTurnos(data.data || []));
    }, [id]);

    return (
        <div>
            <h2>Turnos del Paciente #{id}</h2>

            <ul>
                {turnos.map(t => (
                    <li key={t.id}>
                        {t.fecha} – {t.hora} – {t.estado}
                        <Link to={`/turnos/${t.id}`}> Ver </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
