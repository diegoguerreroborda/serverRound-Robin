const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Fs = require('fs') ;
const Path = require('path')
const port = 3050;

const app = express()
app.use(cors())

let count = 0;
let hosts = [{path: "http://localhost:4011/", alive: false}, {path: "http://localhost:3001/", alive: false}, {path: "http://localhost:3002/", alive: false}];
let urlG;

var checkCount = () => {
    if(count < hosts.length-1){
        count++;
    }else{
        count = 0;
    }
}

app.all('/send_image', async(req, res, next) => {
    let pass = true
    while (pass) {
        urlG = hosts[count].path
        console.log(`Probando con: ${hosts[count].path}`)
        checkCount()
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
    //console.log(`Host: ${hosts[count].path} encendido: ${hosts[count].alive}`)
    url = urlG + 'data_img';
    //console.log(req.body.image)
    console.log(req.body)
    axios({
        method: 'post',
        url,
        data: {
          img: req.body
        }
      }).then(res => {
          console.log("Entra?");
      }).catch(err => {
          console.log(err);
      });
  });

app.get('/received_image', async(req, res) => {
    console.log("Llega del servidor, va hacia el cliente");
    await axios.get(urlG + "info_img")
    .then(function (response) {
        res.send(response.data.img);
    }).catch(function (error) {
        console.log("Error al recibir imagen");
    });
});

app.get('/info_servers', async(req,res) => {
    //Envía json al cliente del estado de los servers
    for (const host in hosts) {
        try {
            response = await axios(hosts[host].path)
            hosts[host].alive = true;
        } catch(err) {
            hosts[host].alive = false;
            console.log(err.toString())
        }
    }
    res.json(hosts);
  })
  
  app.get('/create_server', (req, res) => {
      //Crear linea en el bash para crear una instancia de docker y agregarla a la lista
  })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})