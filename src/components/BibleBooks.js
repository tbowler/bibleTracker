import React from "react";
import { ref, get, set, update, onValue} from "firebase/database";
import { Button, Grid, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Books from './Books';
import ChapterDisplay from './ChapterDisplay';
const bibleApi = require('../api/bible');
console.log('getChapter', bibleApi.getChapter)
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
        });
      }
    });
    get(ref(this.props.db, `overview/${this.props.user.uid}`)).then((snapshot) => {
      if (!snapshot.exists()) {
        update(ref(this.props.db, `overview/${this.props.user.uid}`), {
          name: this.props.user.displayName,
          percentComplete: 0,
        });
      }
    });

    onValue(ref(this.props.db, `users/${this.props.user.uid}/books`), (snapshot) => {
      this.setState({
        userBookList: snapshot.val(),
      }, () => console.log('userBookList', this.state.userBookList));
    });

    this.getOverview();  
  };

  async getOverview() {
    if (!_.isUndefined(_.get(this.props, 'user.uid', undefined))) {
      // update the overview whenever it changes
      onValue(ref(this.props.db, `/overview`), (snapshot) => {
        this.setState({
          users: _.orderBy(snapshot.val(), 'percentComplete', 'desc').slice(0, 3),
          fullListOfUsers: _.orderBy(snapshot.val(), 'percentComplete', 'desc'),
        });
      });
    }
  }

  fetchChapter = async (book, chapter) => {
    const data = await bibleApi.getChapter(book, chapter);
    this.setState({book, chapterNumber: chapter, chapter: data}); 
  }

  getChaptersRead = () => {
    let total = 0;
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
          <Grid item xs={12} sm={6} md={3}>
            <strong>Leaderboard</strong><br />
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Place</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Complete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.users.length > 0 && (
                    _.map(this.state.users, (user, key) => {
                      return (
                        <TableRow
                          key={`user-${key}`}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {key+1}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {user.name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {`${Number.parseFloat(user.percentComplete).toFixed(2)}%`}
                          </TableCell>
                        </TableRow>
                      );
                    }))}
                </TableBody>
              </Table>
            </TableContainer>   
            {this.state.fullListOfUsers.length > 3 && this.state.users.length === 3 && (
              <Chip label="Show All" onClick={() => this.showAllUsers()} />
            )}
            {this.state.fullListOfUsers.length > 3 && this.state.users.length !== 3 && (
              <Chip label="Show Less" onClick={() => this.showLessUsers()} />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={9}>
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
