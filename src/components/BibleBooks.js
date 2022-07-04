import React from "react";
import { ref, get, set, update, onValue} from "firebase/database";
import { Button, Grid } from '@mui/material';
import Books from './Books';
import ChapterDisplay from './ChapterDisplay';
const bibleApi = require('../api/bible');
const _ = require('lodash');
const totalChapters = 1189;

class BibleBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      users: [],
      fullListOfUsers: [],
      fetchChapter: true,
      book: null,
      chapterNumber: null,
      chapter: null,
      showCompleteList: false,
    };
  }

  componentDidMount() {
    get(ref(this.props.db, `users/${this.props.user.uid}`)).then((snapshot) => {
      if (!snapshot.exists()) {
        update(ref(this.props.db, `users/${this.props.user.uid}`), {
          name: this.props.user.displayName,
          photoURL: this.props.user.photoURL,
        });
      }
    });
    get(ref(this.props.db, `overview/${this.props.user.uid}`)).then((snapshot) => {
      if (!snapshot.exists()) {
        console.log(this.props.user);
        update(ref(this.props.db, `overview/${this.props.user.uid}`), {
          name: this.props.user.displayName,
          percentComplete: 0,
          photoURL: this.props.user.photoURL,
        });
      }
    });

    onValue(ref(this.props.db, `users/${this.props.user.uid}/books`), (snapshot) => {
      this.setState({
        userBookList: snapshot.val(),
      });
    });
  };

  fetchChapter = async (book, chapter) => {
    const data = await bibleApi.getChapter(book, chapter);
    this.setState({book, chapterNumber: chapter, chapter: data}); 
  }

  getChaptersRead = () => {
    let total = 1;
    _.forEach(_.keys(_.get(this.state, 'userBookList', {})), (key) => {
      total = total + _.get(this.state, `userBookList[${key}]`, []).length;
    });

    return total;
  }

  completeChapter = () => {
    const chaptersRead = this.getChaptersRead();
    const percentComplete = (chaptersRead / totalChapters) * 100;
    set(ref(this.props.db, `users/${this.props.user.uid}/books/${this.state.book}/${this.state.chapterNumber}`), (new Date()).toISOString());
    set(ref(this.props.db, `overview/${this.props.user.uid}/percentComplete`), percentComplete);
  }

  getColor = (key) => {
    if (key === 0) {
      return 'primary';    
    } else if (key === 1) {
      return 'secondary';    
    } else if (key === 2) {
      return 'warning';    
    } else {
      return 'inherit';
    }
  }

  showAllUsers = () => {
    this.setState({
      users: this.state.fullListOfUsers,
    });
  }

  showLessUsers = () => {
    this.setState({
      users: this.state.fullListOfUsers.slice(0, 3),
    });
  }

  render() {
    const isChapterComplete = _.get(this, `state.userBookList[${this.state.book}][${this.state.chapterNumber}]`, null);
    return (
      <div className="App-header">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Books fetchChapter={this.fetchChapter} userBookList={this.state.userBookList} />
            {this.state.chapter && (
              <>
              <ChapterDisplay chapter={this.state.chapter} />
              <Button
                variant="contained"
                color={isChapterComplete !== null ? 'secondary' : 'primary'}
                disabled={isChapterComplete !== null}
                onClick={() => this.completeChapter()}
              >
                {isChapterComplete !== null ? 'Complete' : 'Mark Complete'}
              </Button>
              </>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default BibleBooks;
