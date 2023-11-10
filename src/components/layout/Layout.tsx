import { Board } from '../board/Board'
import Header from './Header'
import styles from './layout.module.css'
const Layout = () => {
  return (
    <div className={styles.layoutContainer}>
      <Header />
      <Board />
    </div>
  )
}

export default Layout
