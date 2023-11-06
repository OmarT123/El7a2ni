import {Link} from 'react-router-dom'

const NavBar = () => {
    return (
        <header>
            <div className='container'>
                <Link to="/">
                    <h1>Home</h1>
                </Link>
            </div>
        </header>
    )
}

export default NavBar