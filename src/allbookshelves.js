/**
 * Created by bganguly on 7/4/17.
 */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import IndividualBookShelf from './individualbookshelf'
import * as BooksAPI from './utils/BooksAPI'

class AllBookShelves extends Component {

  // consolidatedBookShelf is essentially the collection when the main page loads.
  // Its being used as a quick object value lookup when key (bookId) is provided, when moving books
  // between shelves. In that operation, the PUT only returns the bookId and an appropriate view
  // reconciliation between the PUT response and the target shelf is not easy.
  // This does go against the philosophy of not having duplicative strategy
  state= {
    currentlyReadingBookshelf : null,
    wantToReadBookshelf : null,
    readBookshelf : null,
    consolidatedBookShelf : []
  };

  updateBooksByShelf = (book, targetShelf) => {
    BooksAPI.update(book, targetShelf).then(bookShelves => {
      this.updateBookShelvesById(bookShelves)
    })
  }

  updateBookShelvesById (bookShelves) {
    // bookShelves looks like { currentlyReading:['id1','id2'], wantToRead:['id3']..}
    for (let bookShelfType in bookShelves) {
      if (bookShelves.hasOwnProperty(bookShelfType)) {
        switch (bookShelfType) {
          case 'currentlyReading':
            this.setState({
              currentlyReadingBookshelf: this.mapBookIdsToBooks(bookShelves, bookShelfType)
            });
            break;
          case 'wantToRead':
            this.setState({
              wantToReadBookshelf : this.mapBookIdsToBooks(bookShelves, bookShelfType)
            });
            break;
          case 'read':
            this.setState({
              readBookshelf : this.mapBookIdsToBooks(bookShelves, bookShelfType)
            });
            break;
          default:
            break;
        }
      }
    }
  }

  updateConsolidatedBookShelf = (bookShelfContent) => {
    this.setState({
      consolidatedBookShelf : this.state.consolidatedBookShelf.concat(bookShelfContent)
    })
  }

  mapBookIdsToBooks (bookShelves, bookShelfType) {
    return bookShelves[bookShelfType].map((bookId) => {
      return this.state.consolidatedBookShelf.find((book) => {
        return book.id === bookId;
      })
    }, this)
  }

  render () {
    const {currentlyReadingBookshelf, wantToReadBookshelf, readBookshelf} = this.state

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <IndividualBookShelf bookShelfType="currentlyReading" bookShelfContent={currentlyReadingBookshelf}
               bookShelfName="Currently Reading" moveBookToTargetShelf={this.updateBooksByShelf}
               updateConsolidatedBookShelf={this.updateConsolidatedBookShelf}/>
            <IndividualBookShelf bookShelfType="wantToRead" bookShelfContent={wantToReadBookshelf}
               bookShelfName="Want To Read"  moveBookToTargetShelf={this.updateBooksByShelf}
                updateConsolidatedBookShelf={this.updateConsolidatedBookShelf}/>
            <IndividualBookShelf bookShelfType="read" bookShelfContent={readBookshelf}
               bookShelfName="Read"  moveBookToTargetShelf={this.updateBooksByShelf}
               updateConsolidatedBookShelf={this.updateConsolidatedBookShelf}/>
          </div>
        </div>
        <div className="open-search">
          <Link to="/search">Add a book </Link>
        </div>
      </div>
    )
  }
}

export default AllBookShelves