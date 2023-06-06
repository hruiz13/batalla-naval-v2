import { Route } from 'wouter'

import { Board } from './components/board/Board'
import { Home } from './modules/Home'
import './App.css'

function App () {
  return (
    <>
      <Route path='/' component={Home}/>
      <Route path='/board'>
        <Board name='player' />
      </Route>

    </>
  )
}

export default App
