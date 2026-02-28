import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token"); 

    // 1) Validación básica: si no hay token → login
    if (!token) {
      navigate("/login");
      return;
    }

    // 2) Validación real: pegar a /api/private con Bearer token
    const fetchPrivate = async () => {
      try {
        const resp = await fetch(`${backendUrl}/api/private`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await resp.json();

        if (!resp.ok) {
          // token inválido/expirado → limpiar y mandar a login
          sessionStorage.removeItem("token");
          setError(data.msg || "Token inválido");
          navigate("/login");
          return;
        }

        setUser(data.user);
      } catch (e) {
        setError("Error de conexión con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchPrivate();
  }, [navigate, backendUrl]);

  if (loading) return <div className="container mt-5">Cargando...</div>;

 return (
  <div className="container mt-5">
    <h2>Private</h2>

    {error && <div className="alert alert-danger">{error}</div>}

    {user && (
      <div className="alert alert-success">
        <div><b>Acceso concedido</b></div>
        <div>Email: {user.email}</div>
        <div>ID: {user.id}</div>
      </div>
    )}

    <button
      className="btn btn-outline-danger"
      onClick={() => {
        sessionStorage.removeItem("token");
        navigate("/login");
      }}
    >
      Cerrar sesión
    </button>
  </div>
);
};