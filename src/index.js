import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import BooksApp from './booksapp'
import './index.css'

ReactDOM.render(
  <BrowserRouter>
    <BooksApp/>
  </BrowserRouter>,
  document.getElementById('root')
);
