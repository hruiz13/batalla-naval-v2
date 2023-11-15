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
  const { setPlayerName, setOtherPlayerName } = useBoardStore()

  const [userName, setUserName] = useState('')
  const [connectionModal, setConnectionModal] = useState(false)
  const [isConected, setIsConected] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [customMessage, setcustomMessage] = useState('')

  const searchParams = new URLSearchParams(window.location.search)

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
      const roomUuid = searchParams.get('room')
      if (roomUuid) {
        socket.emit('join_room', { userName, roomUuid })
      } else {
        const newRoomUuid = crypto.randomUUID()
        socket.emit('new_room', { userName, roomUuid: newRoomUuid })
        setLocation(`/board?room=${newRoomUuid}`)
      }
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

    function onError (data: any) {
      alert(`ocurrio un error, ${JSON.stringify(data)}`)
    }

    function onRoomFull () {
      setcustomMessage('La partida esta llena')
    }

    function onRoomJoined (data: any) {
      setOtherPlayerName(data?.userName ?? '')
      setLocation(`/board?room=${searchParams.get('room') ?? ''}`)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('error', onError)
    socket.on('room_full', onRoomFull)
    socket.on('joined_room', onRoomJoined)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('error', onError)
      socket.off('room_full', onRoomFull)
      socket.off('joined_room', onRoomJoined)
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
            hasError && <p>Ha ocurrido un error, por favor intente mas tarde</p>
          }
          {
            !hasError && !customMessage && <p>Conectando con el servidor...</p>
          }
          {
            customMessage && <>
              <p>{customMessage}</p>
              <button className={style.btn} onClick={() => setConnectionModal(false)}>Cerrar</button>
            </>
          }
          <Waves />
        </dialog>
    }
  </div>
  <Waves />
  </>
}
