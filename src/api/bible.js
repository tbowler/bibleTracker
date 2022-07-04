const axios = require("axios");

module.exports.getChapter = async function(book,chapter) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      url: `https://bible-api.com/${book}+${chapter}?translation=kjv`,
    };
    
    axios.request(options).then(function (response) {
      resolve(response.data);
    }).catch(function (error) {
      console.error(error);
    });    
  });
};