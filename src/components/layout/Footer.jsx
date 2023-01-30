import styles from './Footer.module.css';
import { FaFacebook, FaInstagram, FaLinkedin} from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <ul>
        <li><a href="https://www.facebook.com" target="_blank"><FaFacebook/></a></li>
        <li><a href="https://www.instagram.com" target="_blank"><FaInstagram/></a></li>
        <li><a href="https://br.linkedin.com" target="_blank"><FaLinkedin/></a></li>
      </ul>
      <p><span className='color'>Costs</span>&copy; 2023</p>
    </footer>
  )
}

export default Footer