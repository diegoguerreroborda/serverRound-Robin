const express = require('express');
const axios = require('axios');
const cors = require('cors');
var ping = require('ping');
const port = process.argv[2];

const app = express()
app.use(cors())

let count = 0;
let hosts = ["http://localhost:3000/", "http://localhost:3001/", "http://localhost:3002/"];
let url;

var checkCount = (req, res, next) => {
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
        console.log(`Servidor prendido`);
        next();
    }).catch(function (error) {
        console.log("Error server");
        validateHost();
    });
})

var validateHost2 = async(req, res, next) => {
    console.log(hosts[count]);
    url = hosts[count];
    checkCount();
    try {
        const resp = await axios.get(url);
        console.log(resp.data);
        next();
    } catch (err) {
        console.error(err);
        validateHost2();
    }
}

var validateHost3 = async (req, res, next) => {
    let pass = true
    while (pass) {
        console.log(hosts[count]);
        url = hosts[count];
        checkCount();
        try {
            res = await axios(url)
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
}

app.use('/send_image', validateHost3);

app.post('/send_image', (req, res) => {
    console.log("llega del cliente, va hacia el servidor");
    let requestImg = req.header('Content-type');
    axios({
        method: 'post',
        url: 'http://localhost:3002/data_client',
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
    axios.get('http://localhost:3002/info_client')
    .then(function (response) {
        res.send(response.data.img);
    }).catch(function (error) {
        console.log("Error al recibir imagen");
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})