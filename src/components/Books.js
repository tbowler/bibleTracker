import React from "react";
import { InputLabel, MenuItem, FormControl, Select, Grid} from '@mui/material';
const _ = require('lodash');
const books = [
  {name: "Genesis", count: 50},
  {name: "Exodus", count: 40},
  {name: "Leviticus", count: 27},
  {name: "Numbers", count: 36},
  {name: "Deuteronomy", count: 34},
  {name: "Joshua", count: 24},
  {name: "Judges", count: 21},
  {name: "Ruth", count: 4},
  {name: "1 Samuel", count: 31},
  {name: "2 Samuel", count: 24},
  {name: "1 Kings", count: 22},
  {name: "2 Kings", count: 25},
  {name: "1 Chronicles", count: 29},
  {name: "2 Chronicles", count: 36},
  {name: "Ezra", count: 10},
  {name: "Nehemiah", count: 13},
  {name: "Esther", count: 10},
  {name: "Job", count: 42},
  {name: "Psalms", count: 150},
  {name: "Proverbs", count: 31},
  {name: "Ecclesiastes", count: 12},
  {name: "Song of Songs", count: 8},
  {name: "Isaiah", count: 66},
  {name: "Jeremiah", count: 52},
  {name: "Lamentations", count: 5},
  {name: "Ezekiel", count: 48},
  {name: "Daniel", count: 12},
  {name: "Hosea", count: 14},
  {name: "Joel", count: 3},
  {name: "Amos", count: 9},
  {name: "Obadiah", count: 1},
  {name: "Jonah", count: 4},
  {name: "Micah", count: 7},
  {name: "Nahum", count: 3},
  {name: "Habakkuk", count: 3},
  {name: "Zephaniah", count: 3},
  {name: "Haggai", count: 2},
  {name: "Zechariah", count: 14},
  {name: "Malachi", count: 4},
  {name: "Matthew", count: 28},
  {name: "Mark", count: 16},
  {name: "Luke", count: 24},
  {name: "John", count: 21},
  {name: "Acts", count: 28},
  {name: "Romans", count: 16},
  {name: "1 Corinthians", count: 16},
  {name: "2 Corinthians", count: 13},
  {name: "Galatians", count: 6},
  {name: "Ephesians", count: 6},
  {name: "Philippians", count: 4},
  {name: "Colossians", count: 4},
  {name: "1 Thessalonians", count: 5},
  {name: "2 Thessalonians", count: 3},
  {name: "1 Timothy", count: 6},
  {name: "2 Timothy", count: 4},
  {name: "Titus", count: 3},
  {name: "Philemon", count: 1},
  {name: "Hebrews", count: 13},
  {name: "James", count: 5},
  {name: "1 Peter", count: 5},
  {name: "2 Peter", count: 3},
  {name: "1 John", count: 5},
  {name: "2 John", count: 1},
  {name: "3 John", count: 1},
  {name: "Jude", count: 1},
  {name: "Revelation", count: 22}
];

class Books extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      book: _.get(this.props, 'book', 0),
      chapters: _.range(1, 51),
      chapter: _.get(this.props, 'chapter', 0),
      completedChapters: 0,
    };
  }

  onChangeBook = (event) => {
    const total = _.get(books, `[${event.target.value}].count]`, 0) + 1;
    const chapters = _.range(1, total);

    this.setState({
      book: event.target.value,
      chapters
    });
  };

  onChangeChapter = (event) => {
    this.setState({
      chapter: event.target.value,
    }, () => this.props.fetchChapter(_.get(books, `[${this.state.book}].name`, 'Genesis'), this.state.chapter, this.state.book));
  };

  render() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id='initial-book-label'>Book</InputLabel>
            <Select
              labelId='initial-book-label'
              id='initial-book'
              value={this.state.book}
              label='Book'
              onChange={this.onChangeBook}
            >
              {_.map(books, (book, index) => {
                return (
                  <MenuItem key={`${index}-${book.name}`} value={index}>{book.name}</MenuItem>    
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id='initial-chapter-label'>Chapter</InputLabel>
            <Select
              labelId='initial-chapter-label'
              id='initial-chapter'
              value={this.state.chapter}
              label='Chapter'
              onChange={this.onChangeChapter}
            >
              {_.map(this.state.chapters, (chapter, index) => {
                return (
                  <MenuItem key={`${index}-${chapter}`} value={chapter}>{chapter}</MenuItem>    
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
  }
}

export default Books;
