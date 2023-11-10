import { Route } from 'wouter'

import { Home } from './modules/Home'
import './App.css'
import Layout from './components/layout/Layout'

function App () {
  return (
    <>
      <Route path='/' component={Home}/>
      <Route path='/board'>
        <Layout />
      </Route>

    </>
  )
}

export default App
