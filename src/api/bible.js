const axios = require("axios");

export async function getChapter(book,chapter) {
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
