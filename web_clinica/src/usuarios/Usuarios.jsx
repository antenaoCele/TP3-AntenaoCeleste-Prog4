import { useEffect, useState } from "react";
import { useAuth } from "../Auth";
import { Link } from "react-router-dom";

export function Usuarios() {
    const { fetchAuth } = useAuth();
    const [usuarios, setUsuarios] = useState([]);


    useEffect(() => {
        const fetchUsuarios = async () => {
            const response = await fetchAuth("http://localhost:4000/usuarios")
            const data = await response.json();
            if (!response.ok) {
                console.log("Error:", data.error);
                return;
            }

            setUsuarios(data.usuarios);
        }

        fetchUsuarios();
    }, [fetchAuth]);

    return (
        <article>
            <h2>Usuarios</h2>
            <table>
                <thead>
                    <tr><th>Nombre</th><th>Email</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                    {usuarios.map((u) => (
                        <tr key={u.id}>
                            <td>{u.nombre}</td>
                            <td>{u.email}</td>
                            <td><Link to={`/usuarios/${u.id}/modificar`} role="button" className="secondary">Modificar</Link></td>
                            <td><Link to={`/usuarios/${u.id}`} role="button" className="secondary">Ver</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/usuarios/crear" role="button">Crear nuevo usuario</Link>
        </article>
    );
}
