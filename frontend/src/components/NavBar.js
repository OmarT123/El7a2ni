import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <header style={headerStyle}>
            <div className='container' style={containerStyle}>
                <Link to="/" style={linkStyle}>
                    <h1 style={titleStyle}>Virtual Clinic</h1>
                </Link>
            </div>
        </header>
    );
};

// CSS Styles
const headerStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px 0',
};

const containerStyle = {
    maxWidth: '960px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const linkStyle = {
    textDecoration: 'none',
};

const titleStyle = {
    fontSize: '3.5rem',
    color: '#1877F2',
};

export default NavBar;
