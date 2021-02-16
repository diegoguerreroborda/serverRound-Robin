const express = require('express');
const axios = require('axios');
const cors = require('cors');
var ping = require('ping');
const port = process.argv[2];

const app = express()
app.use(cors())

let count = 0;
let hosts = [{port: 3000, available: false}, {port : 3001, available: false}, {port: 3002, available: false}];
hosts = ["http://localhost:3000/", "http://localhost:3001/", "http://localhost:3002/"];
let url = `http://localhost:3000/`;

var checkCount = (req, res, next) => {
    console.log("Entra a checkCount");
    if(count <= hosts.length-1){
        count++;
    }else{
        count = 0;
    }
}

var validateHost = ((req, res, next) => {
    console.log(hosts[count]);
    url = hosts[count];
    checkCount();
    axios.get(url)
    .then(function (response) {
        //Cuando está prendido entra aquí
        console.log(`Respuesta del servidor ${response.data}`);
        next();
        //res.sendStatus(200);
        console.log("burros");
    }).catch(function (error) {
        //Cuando está apagado entra aquí
        console.log("Error server");
        //res.sendStatus(404);ddd
        validateHost();
    });
})

app.use('/send_image', validateHost);

app.post('/send_image', (req, res) => {
    console.log("llega del cliente, va hacia el servidor");
    let requestImg = req.header('Content-type');
    axios({
        method: 'post',
        url: 'http://localhost:3001/data_client',
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
    axios.get('http://localhost:3001/info_client')
    .then(function (response) {
        res.send(response.data.img);
    }).catch(function (error) {
        console.log("Error al recibir imagen");
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})