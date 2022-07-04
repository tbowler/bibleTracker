import React from "react";
const _ = require('lodash');

class ChapterDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded : false,
      loading: false,
      content: '',
    };
  }
  
  render() {
    return (
      <div>
        <h5>{this.props.chapter.reference} : {this.props.chapter.translation_name}</h5>
        {_.map(_.get(this, 'props.chapter.verses', []), (verse, key) => {
          return (
            <span key={`verse-${key}`}>
              <span className='verseLabel'>  {verse.verse}.</span> <span>{verse.text}</span>
            </span>
          );
        })}
      </div>
    );
  }
}

export default ChapterDisplay;
