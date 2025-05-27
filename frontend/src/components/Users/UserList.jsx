import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';



function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const BASE_URL = 'http://localhost:8000'; // o el que corresponda

        const response = await axios.get(`${BASE_URL}/api/users`);

      console.log("Respuesta de API:", response.data); // 👈 esto te va a decir si es un array o un objeto
      setUsers(response.data); // Asegurate que sea un array
    } catch (err) {
        console.error(err);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };
  fetchUsers();
}, []);


 /* const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de desactivar este usuario?')) {
      try {
        await axios.delete(`/api/users/${userId}`);
        setUsers(users.map(user => 
          user.USERID === userId ? {...user, is_active: false} : user
        ));
      } catch (err) {
        console.error(err);
        setError('Error al desactivar usuario');
      }
    }
  }*/;

  if (loading) return <div className="text-center mt-4">Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de Usuarios</h2>
        <Link to="/users/new" className="btn btn-success">
          Crear Usuario
        </Link>
      </div>
      
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.USERID}>
              <td>{user.USER_CODE}</td>
              <td>{user.U_NAME}</td>
              <td>{user.E_Mail || '-'}</td>
              <td>
                <span className={`badge ${user.is_active ? 'bg-success' : 'bg-secondary'}`}>
                  {user.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <Link to={`/users/${user.USERID}`} className="btn btn-sm btn-primary me-2">
                  Editar
                </Link>
                {/*user.is_active && (
                  <button 
                    onClick={() => handleDelete(user.USERID)}
                    className="btn btn-sm btn-danger"
                  >
                    Desactivar
                  </button>
                )*/}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;