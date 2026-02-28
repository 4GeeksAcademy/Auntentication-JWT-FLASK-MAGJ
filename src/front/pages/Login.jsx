import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${backendUrl}/api/token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.msg || "Error al iniciar sesión");
                return;
            }

            // Guardar token
            sessionStorage.setItem("token", data.access_token);

            navigate("/private");

        } catch (err) {
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Iniciar sesión
                </button>
            </form>
        </div>
    );
};
