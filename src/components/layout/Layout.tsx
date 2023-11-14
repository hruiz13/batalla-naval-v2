import { Board } from '../board/Board'
import Header from './Header'
import styles from './layout.module.css'
const Layout = () => {
  return (
    <div className={styles.layoutContainer}>
      <Header />
      <div className={styles.bodyContainer}>
        <Board />
      </div>
    </div>
  )
}

export default Layout
