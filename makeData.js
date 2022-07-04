const loop = [
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
const _ = require('lodash');
const books = [];
_.forEach(loop, (item) => {
  const abbreviation = item.name.toLowerCase().substring(0,3);
  // 111 is NIV
  // const numbers = _.range(item.count);
  const book = {
    name: item.name,
    abbreviation,
    chapters: [],
  };
  _.forEach(numbers, (number) => {
    book.chapters.push({
      name: item.name,
      link:  `https://www.bible.com/bible/111/${abbreviation}.${(number+1)}`,
      started: null,
      complete: null,
    })
  });
  books.push(book);
});
