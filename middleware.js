const express = require('express');
const axios = require('axios');
const cors = require('cors');
var ping = require('ping');
const port = process.argv[2];

const app = express()
app.use(cors())

let count = 0;
let hosts = ["http://localhost:3000/", "http://localhost:3001/", "http://localhost:3002/"];
let urlG;

var checkCount = (req, res, next) => {
    if(count <= hosts.length-1){
        count++;
    }else{
        count = 0;
    }
}

app.all('/send_image', async(req, res, next) => {
    let pass = true
    while (pass) {
        console.log(hosts[count]);
        urlG = hosts[count];
        checkCount();
        try {
            res = await axios(urlG)
            pass = false;
        } catch(err) {
            if (err.response) {
                console.log(err.response.status)
            } else {
                console.log(err.toString())
            }
        }
    }
    next();
})

app.post('/send_image', (req, res) => {
    console.log("llega del cliente, va hacia el servidor");
    url = urlG + 'data_client';
    axios({
        method: 'post',
        url,
        data: {
          img: req.header('Content-type')
        }
      }).then(res => {
          console.log(res.config.data);
      }).catch(err => {
          console.log(err);
      });
  });

app.get('/received_image', (req, res) => {
    console.log("Llega del servidor, va hacia el cliente");
    axios.get(urlG + "info_client")
    .then(function (response) {
        res.send(response.data.img);
    }).catch(function (error) {
        console.log("Error al recibir imagen");
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})