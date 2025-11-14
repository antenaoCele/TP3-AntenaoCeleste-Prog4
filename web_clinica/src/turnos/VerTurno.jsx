import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Auth";

export const VerTurno = () => {
    const { id } = useParams();
    const { fetchAuth } = useAuth();

    const [turno, setTurno] = useState(null);
    const [errores, setErrores] = useState([]);

    const fetchTurno = useCallback(async () => {
        const response = await fetchAuth(`http://localhost:4000/turnos/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            setErrores(data.errors || [data.message]);
            return;
        }

        setTurno(data.data);
    }, [fetchAuth, id]);

    useEffect(() => {
        fetchTurno();
    }, [fetchTurno]);

    const actualizar = async () => {
        setErrores([]);

        const response = await fetchAuth(`http://localhost:4000/turnos/${id}`, {
            method: "PUT",
            body: JSON.stringify(turno),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            setErrores(data.errors || [data.message]);
            return;
        }

        alert("Turno actualizado.");
    };

    if (!turno) return <p>Cargando...</p>;

    return (
        <article>
            <h2>Detalles del Turno</h2>

            {errores.length > 0 && (
                <ul style={{ color: "red" }}>
                    {errores.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
            )}

            <p><b>Paciente:</b> {turno.paciente_nombre} {turno.paciente_apellido}</p>
            <p><b>Médico:</b> {turno.medico_nombre} {turno.medico_apellido}</p>
            <p><b>Fecha:</b> {turno.fecha}</p>
            <p><b>Hora:</b> {turno.hora}</p>
            <p><b>Estado:</b> {turno.estado}</p>
            <p><b>Observaciones:</b> {turno.observaciones}</p>


        </article>
    );
};
