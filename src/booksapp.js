import React, { Component }  from 'react'
import { Route } from 'react-router-dom'
import AllBookShelves from './allbookshelves.js'
import SearchBooks from './searchbooks'
import './App.css'

class BooksApp extends Component {
  render() {
    return (
      <div className="app">
        <Route exact path="/" component={AllBookShelves}/>
        <Route path="/search" component={SearchBooks}/>
      </div>
    )
  }
}

export default BooksApp
