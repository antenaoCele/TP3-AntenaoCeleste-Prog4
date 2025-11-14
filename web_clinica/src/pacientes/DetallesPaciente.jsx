import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Auth";
import { useParams } from "react-router-dom";

export const DetallesPaciente = () => {
    const { fetchAuth } = useAuth();
    const { id } = useParams();

    const [paciente, setPaciente] = useState(null);

    const fetchPaciente = useCallback(async () => {
        const response = await fetchAuth(`http://localhost:4000/pacientes/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            console.log("Error:", data.error);
            return;
        }

        setPaciente(data.data);
    }, [fetchAuth, id]);

    useEffect(() => {
        fetchPaciente();
    }, [fetchPaciente]);

    if (!paciente) return null;

    return (
        <article>
            <h2>Detalles del Paciente</h2>

            <p><b>Nombre:</b> {paciente.nombre} {paciente.apellido}</p>
            <p><b>DNI:</b> {paciente.DNI}</p>
            <p><b>Fecha de nacimiento:</b> {paciente.nacimiento}</p>
            <p><b>Obra Social:</b> {paciente.obraSocial}</p>
        </article>
    );
};
