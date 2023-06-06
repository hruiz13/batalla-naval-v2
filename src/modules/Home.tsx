import { ChangeEvent, FormEvent, useState } from 'react'
import { Ripples } from '@uiball/loaders'

import style from './home.module.css'
import Logo from '../assets/bn.svg'
import { Waves } from '../components/waves/Waves'

export const Home = () => {
  const [userName, setUserName] = useState('')
  const [connectionModal, setConnectionModal] = useState(false)
  console.log('🚀 ~ file: home.tsx:11 ~ Home ~ connectionModal:', connectionModal)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (userName === '') return
    setConnectionModal(true)
  }
  console.log('ESTADO', !!userName)
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
            <p>Conectando con el servidor...</p>
            <Waves />
        </dialog>
    }
    </div>
    <Waves />
  </>
}
