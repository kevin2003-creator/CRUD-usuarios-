import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);

const [formData, setFormData] = useState({
  USER_CODE: '',
  U_NAME: '',
  PASSWORD: '',
  E_Mail: '',
  Department: -2,
  Branch: -2,
  is_active: true
});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:8000/empleados/');
      setEmployees(res.data);
    } catch (err) {
      console.error('Error al cargar empleados', err);
    }
  };

  fetchEmployees();
}, []);


useEffect(() => {
  if (id) {
    const fetchUser = async () => {
      try {
        const BASE_URL = 'http://localhost:8000';
        const response = await axios.get(`${BASE_URL}/api/users/${id}`);
        setFormData({
  USERID: response.data.USERID || '',
  USER_CODE: response.data.USER_CODE || '',
  U_NAME: response.data.U_NAME || '',
  PASSWORD: '',
  E_Mail: response.data.E_Mail || '',
  Department: response.data.Department ?? -2,
  Branch: response.data.Branch ?? -2,
  is_active: response.data.is_active ?? true,
});
      } catch (err) {
        console.error(err);
        setError('Error al cargar el usuario');
      }
    };
    fetchUser();
  }
}, [id]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

const BASE_URL = 'http://localhost:8000';



try {

  if (!id && !formData.PASSWORD) {
  setError("La contraseña es obligatoria al crear un usuario.");
  setIsLoading(false);
  return;
}

  if (id) {
    const payload = { ...formData };

// Si estamos editando y la contraseña está vacía, no la mandamos
if (id && !formData.PASSWORD) {
  delete payload.PASSWORD;
}

await axios.put(`${BASE_URL}/api/users/${id}`, payload);

  } else {
    await axios.post(`${BASE_URL}/api/users`, formData);
  }
  navigate('/users');
} catch (err) {
  setError(err.response?.data?.detail || 'Error al guardar');
} finally {
  setIsLoading(false);
}



  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Editar' : 'Crear'} Usuario</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <label>
  Empleado (USERID):
  <select name="USERID" value={formData.USERID} onChange={handleChange} required>
    <option value="">Seleccione un empleado</option>
    {employees.map(emp => (
      <option key={emp.empID} value={emp.empID}>
        {emp.empID} - {emp.firstName} {emp.lastName}
      </option>
    ))}
  </select>
</label>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre de Usuario</label>
          <input
            type="text"
            className="form-control"
            name="USER_CODE"
            value={formData.USER_CODE}
            onChange={handleChange}
            required
            disabled={!!id}
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Nombre del empleado</label>
          <input
            type="text"
            className="form-control"
            name="U_NAME"
            value={formData.U_NAME}
            onChange={handleChange}
            required
          />
        </div>
<div className="mb-3">
  <label className="form-label">
    {id ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
  </label>
  <input
    type="password"
    className="form-control"
    name="PASSWORD"
    value={formData.PASSWORD}
    onChange={handleChange}
    placeholder={id ? 'Dejar en blanco para no cambiar' : ''}
    required={!id} // Solo requerida si es creación
  />
</div>


        
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="E_Mail"
            value={formData.E_Mail}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Departamento</label>
          <input
            type="number"
            className="form-control"
            name="Department"
            value={formData.Department}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Sucursal</label>
          <input
            type="number"
            className="form-control"
            name="Branch"
            value={formData.Branch}
            onChange={handleChange}
          />
        </div>
        
        {id && (
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              id="isActiveCheck"
            />
            <label className="form-check-label" htmlFor="isActiveCheck">
              Usuario Activo
            </label>
          </div>
        )}
        
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/users')}
        >
          Cancelar
        </button>

      </form>
    </div>
    
  );
}

export default UserForm;