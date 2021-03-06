const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Fs = require('fs') ;
var path = require('path');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
const nodemailer = require('nodemailer');
const shell = require('shelljs');
//const { text } = require('express');
//const cron = require('cron');
const port = 3050;

const app = express()
app.use(cors())

let count = 0;
let portContent = 4000;
let hosts = [{path: "http://localhost:3098/", alive: false}, {path: "http://localhost:3099/", alive: false}];
let urlG;
let textServers = 'Servidores... \n';
//shell.exec('./run_logs.sh');

var checkCount = () => {
    if(count < hosts.length-1){
        count++;
    }else{
        count = 0;
    }
}

var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: 'fuera.deo.tunja@gmail.com',
      pass: 'lalala123..'
    }
  });

function base64_decode(base64str, file) {
    var bitmap = new Buffer(base64str, 'base64');
    Fs.writeFileSync(file, bitmap);
    console.log('Image convertida con exito');
}

function base64_encode(file) {
    var bitmap = Fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

app.all('/send_imagedad', async(req, res, next) => {
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

app.post('/send_imagedad', upload.single('myImage'), (req, res) => {
    var x = base64_encode(req.file.path)
    console.log("llega del cliente, va hacia el servidor");
    url = urlG + 'data_img';
    axios({
        method: 'post',
        url,
        data: {
          img: x
        }
      }).then(res => {
          console.log("Entra?");
      }).catch(err => {
          res.sendStatus(404)
          console.log(err);
      }); 
      //res.sendStatus(200);
      //console.log("enviado al servidor")
})

app.get('/received_image', async(req, res) => {
    console.log("Llega del servidor, va hacia el cliente");
    await axios.get(urlG + "info_img")
    .then(function (response) {
        //base64_decode(response.data.img, 'ho.png')
        //res.send(response.data.img);

        //console.log(response.data.img)
        //var image = base64_decode(response.data.img, '1.png')
        //console.log("Se va a enviar")
        res.send(response.data.img)
        //console.log("ya se envío")
    }).catch(function (error) {
        res.sendStatus(404);
        console.log("Error al enviar imagen");
    });
});

app.get('/info_servers', (req,res) => {
    //Envía json al cliente del estado de los servers
    res.json(hosts);
  })
  
app.get('/create_server', (req, res) => {
    //Crear linea en el bash para crear una instancia de docker y agregarla a la lista
    portContent++;
    shell.exec(`sh create_server.sh ${portContent}`)
    hosts.push({path: `http://localhost:${portContent}/`, alive: true})
    res.json(hosts);
})

app.get('/send_email', (req, res) => {
    //console.log(textServers)
    transporter.sendMail({
        from: 'fuera.deo.tunja@gmail.com',
        to: 'diegoguerreroborda@gmail.com',
        subject: 'Error de servidores',
        text: textServers
    });
    res.sendStatus(200)
})

app.get('/info_logs', async(req, res) => {
    textServers = 'Servidores... \n';
    for (const host in hosts) {
        try {
            response = await axios(hosts[host].path)
            textServers += `Path: ${hosts[host].path}--- ok \n`
            hosts[host].alive = true;
        } catch(err) {
            hosts[host].alive = false;
            textServers +=`Path: ${hosts[host].path}--- error servidor no responde \n`
            textServers += err.toString();
            console.log(err.toString())
        }
    }
    res.send(textServers);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
