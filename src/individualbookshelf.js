/**
 * Created by bganguly on 7/4/17.
 */

import React, { Component } from 'react'
import * as BooksAPI from './utils/BooksAPI'
import sortBy from 'sort-by'

class IndividualBookShelf extends Component {
  state= {
    bookShelfType : this.props.bookShelfType,
    bookShelfName : this.props.bookShelfName,
    moveBookToTargetShelf : this.props.moveBookToTargetShelf,
    updateConsolidatedBookShelf : this.props.updateConsolidatedBookShelf,
    bookShelfContent : []
  };

  getBooksByShelf (books, shelf)  {
    return books.filter((book) => {
      return book.shelf === shelf
    }).sort(sortBy('title'))
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.bookShelfContent !== null ) {
      this.setState({
        bookShelfContent : nextProps.bookShelfContent.sort(sortBy('title'))
      })
    }
  }

  componentDidMount () {
    const {bookShelfType, updateConsolidatedBookShelf } = this.state
    BooksAPI.getAll().then ( (books) => {
      this.setState({
        bookShelfContent : this.getBooksByShelf(books, bookShelfType)
      })
      updateConsolidatedBookShelf(this.state.bookShelfContent)
    })
  }

  render () {
    const {bookShelfType, bookShelfName, moveBookToTargetShelf, bookShelfContent} = this.state

    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{bookShelfName}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {bookShelfContent.map((book) => (
              <li  key={book.id} >
                <div className="book">
                  <div className="book-top">
                    <div className="book-cover"
                         style={{backgroundImage: `url(${book.imageLinks['smallThumbnail']})` }}>
                    </div>
                    <div className="book-shelf-changer">
                      <select value={bookShelfType}
                        onChange={(event) =>
                        {moveBookToTargetShelf(book,  (event.target.value))}}>
                        <option value="none" disabled>Move to...</option>
                        <option value="currentlyReading">Currently Reading</option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                  <div className="book-title">{book.title}</div>
                  <div className="book-authors">{book.authors}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  }
}

export default IndividualBookShelf