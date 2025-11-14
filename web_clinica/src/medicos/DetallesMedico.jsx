import { useEffect, useState } from "react";
import { useAuth } from "../Auth";
import { useParams } from "react-router-dom";

export const DetallesMedico = () => {
    const { fetchAuth } = useAuth();
    const { id } = useParams();
    const [medico, setMedico] = useState(null);


    useEffect(() => {
        const fetchMedico = async () => {
            const response = await fetchAuth(`http://localhost:4000/medicos/${id}`);
            const data = await response.json();

            if (!response.ok || !data.success) {
                console.log("Error al obtener el médico");
                return;
            }

            setMedico(data.data);
        };
        fetchMedico();
    }, [fetchAuth, id]);

    if (!medico) return null;

    return (
        <article>
            <h2>Detalles del médico</h2>
            <p><b>Nombre:</b> {medico.nombre}</p>
            <p><b>Apellido:</b> {medico.apellido}</p>
            <p><b>Especialidad:</b> {medico.especialidad}</p>
            <p><b>Matrícula:</b> {medico.matricula}</p>
        </article>
    );
};
