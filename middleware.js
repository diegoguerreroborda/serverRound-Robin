const express = require('express');
const axios = require('axios');
const cors = require('cors');
var ping = require('ping');
const port = process.argv[2];

const app = express()
app.use(cors())

let responseServer = "";
let requestImg = "";
let count = 0;
let hosts = [3000, 3001, 3002];
let portServer = 3000;
let url = `http://localhost:${portServer}/info_client`;

var checkCount = (req, res, next) => {
    console.log("entra2");
    if(count >= hosts.length-2){
        count++;
    }else{
        count = 0;
    }
}

var validateHost = function(req, res, next) {
    //Algoritmo de round robin
    let urlAsigned = false;
        axios.get(`http://localhost:3000/`)
        .then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            // handle error
            console.log("Error");
        }).then(function () {
            // always executed
        });

    next();
  }

app.use('/send_image', validateHost);

app.post('/send_image', (req, res) => {
    console.log("llega del cliente");
    requestImg = req.header('Content-type');
    axios({
        method: 'post',
        url: 'http://localhost:3000/data_client',
        data: {
          img: requestImg
        }
      }).then(res => {
          console.log(res.config.data);
      }).catch(err => {
          console.log(err);
      });
  });

app.get('/received_image', (req, res) => {
    console.log("Llega del servidor, va hacia el cliente");
    axios.get('http://localhost:3000/info_client')
    .then(function (response) {
        res.send(response.data.img);
    }).catch(function (error) {
        // handle error
        console.log("Error");
    }).then(function () {
        // always executed
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})