import React from "react";
import { ref, get, update, onValue} from "firebase/database";
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Grid, Chip, Typography } from '@mui/material';
import LinearProgressWithLabel from './LinearProgressWithLabel';
const _ = require('lodash');

class Leaderboard extends React.Component {
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
      });
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

  getChaptersRead = () => {
    let total = 1;
    _.forEach(_.keys(_.get(this.state, 'userBookList', {})), (key) => {
      total = total + _.get(this.state, `userBookList[${key}]`, []).length;
    });

    return total;
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
    if (!this.props.showLeaderboard) {
      return ('');
    }

    return (
      <div className="App-leader-board">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <strong>Leaderboard</strong><br />
           
            <Grid container spacing={0}>
              {this.state.users.length > 0 && (
                _.map(this.state.users, (user, key) => {
                  return (
                    <>
                    <Grid item xs={1}>
                      <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
                        {key+1}
                      </Typography>
                    </Grid>
                    <Grid item xs={11}>
                      <List>
                        <ListItem>
                          <ListItemAvatar>
                          <Avatar alt={user.name} src={_.get(user, 'photoURL', '')} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={user.name}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12}>
                      <LinearProgressWithLabel value={Number.parseFloat(_.get(user, 'percentComplete', 0)).toFixed(2)} />
                    </Grid>
                    </>
                  );
              }))}
            </Grid>

          </Grid>
          <Grid item xs={12}>
            {this.state.fullListOfUsers.length > 3 && this.state.users.length === 3 && (
              <Chip label="Show All" onClick={() => this.showAllUsers()} />
            )}
            {this.state.fullListOfUsers.length > 3 && this.state.users.length !== 3 && (
              <Chip label="Show Less" onClick={() => this.showLessUsers()} />
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default Leaderboard;
