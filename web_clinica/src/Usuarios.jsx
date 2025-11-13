import { useEffect, useState } from "react";
import { useAuth } from "./Auth";

export function Usuarios() {
    const { fecthAuth } = useAuth();
    const [usuarios, setUsuarios] = useState([]);


    useEffect(() => {
        const fetchUsuarios = async () => {
            const response = await fecthAuth("http://localhost:4000/usuarios")
            const data = await response.json();
            if (!response.ok) {
                console.log("Error:", data.error);
                return;
            }

            return data.usuarios;

        }

        fetchUsuarios().then((usuarios) => setUsuarios(usuarios));
    }, [fecthAuth]);

    return (
        <ol>
            {usuarios.map((u) => (
                <li key={u.id}>
                    {u.nombre}, correo: {u.nombre}, {u.email}
                </li>
            ))}
        </ol>
    );
}
