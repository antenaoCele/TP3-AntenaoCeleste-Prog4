import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth";

export const CrearTurno = () => {
    const { fetchAuth } = useAuth();
    const navigate = useNavigate();

    const [pacientes, setPacientes] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errores, setErrores] = useState([]);

    const [form, setForm] = useState({
        paciente_id: "",
        medico_id: "",
        fecha: "",
        hora: "",
        estado: "pendiente",
        observaciones: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resPac, resMed] = await Promise.all([
                    fetchAuth("http://localhost:4000/pacientes"),
                    fetchAuth("http://localhost:4000/medicos")
                ]);

                const pacData = await resPac.json();
                const medData = await resMed.json();

                if (pacData.success) setPacientes(pacData.data);
                if (medData.success) setMedicos(medData.data);
            } catch (err) {
                console.log("Error al obtener pacientes/medicos:", err);
            }
        };

        fetchData();
    }, [fetchAuth]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrores([]);

        setLoading(true);
        try {
            const body = {
                paciente_id: Number(form.paciente_id),
                medico_id: Number(form.medico_id),
                fecha: form.fecha,
                hora: form.hora,
                estado: form.estado,
                observaciones: form.observaciones ? String(form.observaciones) : ""
            };

            const response = await fetchAuth("http://localhost:4000/turnos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                if (data.errores) {
                    setErrores(data.errores.map(e => e.msg));
                } else {
                    setErrores([data.message || data.error || "Error al crear turno"]);
                }
                setLoading(false);
                return;
            }

            navigate("/turnos");
        } catch (err) {
            console.log(err);
            alert("Error de red al crear turno.");
            setLoading(false);
        }
    };

    return (
        <article>
            <h2>Crear Turno</h2>

            {errores.length > 0 && (
                <ul style={{ color: "red" }}>
                    {errores.map((e, i) => (
                        <li key={i}>{e}</li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleSubmit}>
                <label>Paciente</label>
                <select
                    name="paciente_id"
                    value={form.paciente_id}
                    onChange={handleChange}
                >
                    <option value="">Seleccione...</option>
                    {pacientes.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.nombre} {p.apellido}
                        </option>
                    ))}
                </select>

                <label>Médico</label>
                <select
                    name="medico_id"
                    value={form.medico_id}
                    onChange={handleChange}
                >
                    <option value="">Seleccione...</option>
                    {medicos.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.nombre} {m.apellido} ({m.especialidad})
                        </option>
                    ))}
                </select>

                <label>Fecha</label>
                <input
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChange}
                />

                <label>Hora</label>
                <input
                    type="time"
                    name="hora"
                    value={form.hora}
                    onChange={handleChange}
                />

                <label>Estado</label>
                <select
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                >
                    <option value="pendiente">Pendiente</option>
                    <option value="atendido">Atendido</option>
                    <option value="cancelado">Cancelado</option>
                </select>

                <label>Observaciones</label>
                <textarea
                    name="observaciones"
                    value={form.observaciones}
                    onChange={handleChange}
                    rows="3"
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Creando..." : "Crear"}
                </button>
            </form>
        </article>
    );
};
