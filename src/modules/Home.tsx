import { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import { Ripples } from '@uiball/loaders'
import { socket } from '../socket'

import style from './home.module.css'
import Logo from '../assets/bn.svg'
import { Waves } from '../components/waves/Waves'
import { useLocation } from 'wouter'
import { useBoardStore } from '../context/boardContext'

export const Home = () => {
  const [, setLocation] = useLocation()
  const { setPlayerName } = useBoardStore()

  const [userName, setUserName] = useState('')
  const [connectionModal, setConnectionModal] = useState(false)
  const [isConected, setIsConected] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (userName === '') return
    setConnectionModal(true)
    setPlayerName(userName)
    // timeout of 8 seconds
    setTimeout(() => {
      if (!isConected) {
        setHasError(true)
      }
    }, 10000)
    if (isConected) {
      setLocation('/board')
    }
  }

  useEffect(() => {
    function onConnect () {
      console.log('Conectado')
      setIsConected(true)
    }

    function onDisconnect () {
      console.log('desconectado')
      setIsConected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [])

  return <><div className={style.homeContainer}>
    <img src={Logo} alt="logo batalla naval" width={400} className={style.logo} />
    <h1>Batalla Naval</h1>
    <h2>Juego Multijugador en linea</h2>
    <div className={style.formContainer}>
      <div>Para comenzar introduzca un nombre de jugador</div>
      <form onSubmit={handleSubmit} className={style.form}>

        <input className={style.input} type="text" autoFocus onChange={handleChange}/>
        <button className={style.btn} type='submit' disabled={!userName}>Continuar</button>
      </form>
    </div>
    <div className={style.cr}>By hruiz 2023</div>
    { connectionModal &&
        <dialog open>
          <h2>ESTADO</h2>
          <div>
            <Ripples
              size={45}
              speed={2}
              color="var(--gray)"
            />
          </div>
          {
            hasError
              ? <p>Ha ocurrido un error, por favor intente mas tarde</p>
              : <p>Conectando con el servidor...</p>
          }
          <Waves />
        </dialog>
    }
  </div>
  <Waves />
  </>
}
