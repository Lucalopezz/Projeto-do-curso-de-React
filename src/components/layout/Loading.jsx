import styles from './Loading.module.css'
import loading from '../../img/loading.svg'

const Loading = () => {
  return (
    <div className={styles.loaderContainer}>
        <img className={styles.loader} src={loading} alt="Carregando" />
    </div>
  )
}

export default Loading