import {Link} from 'react-router-dom'

const NavBar = () => {
    return (
        <header>
            <div className='container'>
                <Link to="/">
                    <h1>Virtual Clinic</h1>
                    <h4>Where medicine is made easy.</h4>
                </Link>
            </div>
        </header>
    )
}

export default NavBar