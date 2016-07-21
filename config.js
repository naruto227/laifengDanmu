/**
 * Created by hzq on 16-7-21.
 */
var path = require('path');

var config = {
    debug: true,
    
    upload: {
        path: path.join(__dirname, 'public/images'),
        url: '/public/upload',
        uploadurl: 'http://120.27.94.166:2999/'
        // uploadurl: 'http://localhost:2999/'
    },
    
    host: "from office",
    
    topn: 800,
    
    db: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'douyu',
        port: 3306
    }

    // db:{
    //     host: 'localhost',
    //     user: 'root',
    //     password: 'xidian@513',
    //     database: 'douyu',
    //     port: 3306
    // }
}

module.exports = config;