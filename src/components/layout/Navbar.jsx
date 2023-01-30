import styles from './Navbar.module.css';
import logo from '../../img/costs_logo.png'
import {Link} from 'react-router-dom'
import Container from './Container';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
        <Container>
            <Link to="/"><img src={logo} alt="Logo do Site" /></Link>
            <ul className={styles.list}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/projects">Projetos</Link></li>
                <li><Link to="/company">Sobre</Link></li>
                <li><Link to="/contact">Contato</Link></li>
            </ul>
        </Container>
    </nav>
  )
}

export default Navbar