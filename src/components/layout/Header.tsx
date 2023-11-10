import style from './header.module.css'
import Logo from '../../assets/bn.svg'
import { useBoardStore } from '../../context/boardContext'
import { useMemo } from 'react'

const Header = () => {
  const { playerName } = useBoardStore()
  const lettersPlayerName = useMemo(() => {
    return playerName.split(' ').map((letter, index) => {
      return <span key={index}>{letter[0].toUpperCase()}</span>
    })
  }, [playerName])

  return (<div className={style.headerContainer}>
    <img src={Logo} alt="logo batalla naval" width={100} className={style.logo} />
    <h1>Batalla Naval</h1>
    <div className={style.headerAvatar}>{lettersPlayerName}</div>
  </div>)
}

export default Header
