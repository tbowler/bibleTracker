import React from "react";
import { ref, get, set, update, onValue} from "firebase/database";
import { Button, Grid, CircularProgress } from '@mui/material';
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
      bookNumber: 0,
      chapterNumber: null,
      chapter: null,
      showCompleteList: false,
      loading: false,
      chapterDownloadeTime: null,
      enableButton: false,
      minutes: 0,
      timeCheck: null,
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

  enableButton = () => {
    this.setState({ enableButton: true });
  }

  startTimer = (duration) => {
    const timeCheck = setTimeout(() => {
      this.enableButton();
    }, duration);
    this.setState({
      timeCheck,
    });
  }

  fetchChapter = async (book, chapter, bookNumber) => {
    this.setState({
      loading: true,
      enableButton: false,
    }, async () => {
      const data = await bibleApi.getChapter(book, chapter, bookNumber);
      // get the number of words to determine how long to wait to enable the button
      const words = _.get(data, 'text', '').split(' ').length;
      // multiply by 0.1 seconds per word
      const duration = (words * 0.1) * 1000;
      const minutes = duration / 1000 / 60;
      this.setState({
        bookNumber,
        book,
        chapterNumber: chapter,
        chapter: data,
        loading: false,
        minutes,
      }, () => {
        this.startTimer(duration);
      }); 
    })
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

  isButtonDisabled = () => {
    const isChapterComplete = _.get(this, `state.userBookList[${this.state.book}][${this.state.chapterNumber}]`, null);

    if (isChapterComplete !== null) {
      return 0;
    }

    // Disable the button until a certain amount of time has elapsed
    if(_.get(this, 'state.enableButton', false) === false) {
      return 1;
    }

    return 2;
  }

  render() {
    console.log('this.state.timeCheck', this.state.timeCheck);
    if (this.state.loading) {
      return (
        <CircularProgress />
      );
    }

    const buttonDisabled = this.isButtonDisabled();
    return (
      <div className="App-header">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Books 
              book={_.get(this, 'state.bookNumber', 0)}
              fetchChapter={this.fetchChapter}
              userBookList={this.state.userBookList}
              chapter={_.get(this, 'state.chapterNumber', 0)}
            />
          </Grid>
          {this.state.chapter && (
            <>
            <Grid item xs={12}>
              <ChapterDisplay chapter={this.state.chapter} />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color={(buttonDisabled === 1 || buttonDisabled === 0) ? 'secondary' : 'primary'}
                disabled={(buttonDisabled === 1 || buttonDisabled === 0)}
                onClick={() => this.completeChapter()}
              >
                {buttonDisabled === 0 && ('Complete')}
                {buttonDisabled === 1 && (`Waiting ${_.get(this, 'state.minutes', 0).toFixed(2)} Minutes`)}
                {buttonDisabled === 2 && ('Mark Complete')}
              </Button>
            </Grid>
            </>
          )}
        </Grid>
      </div>
    );
  }
}
export default BibleBooks;
