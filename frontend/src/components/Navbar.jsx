import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function AppNavbar() {
  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Seguridad Global
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/departamentos">
              Departamentos
            </Nav.Link>
            <Nav.Link as={NavLink} to="/puestos">
              Puestos
            </Nav.Link>
            <Nav.Link as={NavLink} to="/empleados-lista">
              Empleados
            </Nav.Link>
            <Nav.Link as={NavLink} to="/empleados">
              Reconocimiento facial
            </Nav.Link>
            <Nav.Link as={NavLink} to="/users">
              Lista de Usuarios
            </Nav.Link>
            <Nav.Link as={NavLink} to="/users/new">
              Crear Usuario
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
