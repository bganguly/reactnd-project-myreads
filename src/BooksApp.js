import React, { Component }  from 'react'
import { Route } from 'react-router-dom'
import AllBookShelves from './AllBookShelves'
import SearchBooks from './SearchBooks'
import './App.css'

class BooksApp extends Component {
  render() {
    return (
      <div className="app">
        <Route exact path="/" render={() => (
          <AllBookShelves/>
        )}/>
          <Route path="/search" render={() => (
            <SearchBooks/>
          )}/>
      </div>
    )
  }
}

export default BooksApp
