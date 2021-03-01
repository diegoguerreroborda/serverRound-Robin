const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Fs = require('fs') ;
var path = require('path');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
const nodemailer = require('nodemailer');
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

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com ',
    port: 465,
    auth: {
      user: 'fuera.deo.tunja@gmail.com',
      pass: 'lalala123..'
    }
  });

var mailOptions = {
    from: 'fuera.deo.tunja@gmail.com',
    to: 'diegoguerreroborda@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

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
    console.log("Escoge server")
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
/*
app.post('/send_image', (req, res) => {
    console.log("llega del cliente, va hacia el servidor");
    //console.log(`Host: ${hosts[count].path} encendido: ${hosts[count].alive}`)
    url = "http://localhost:3001/" + 'data_img';
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
*/
  app.post('/send_imagedad', upload.single('myImage'), (req, res) => {
    var x = base64_encode(req.file.path)
    //console.log(x)
    //var nameFile = req.file.filename
    //base64_decode(x, `${nameFile}.png`)
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
      res.sendStatus(200);
      console.log("enviado al servidor")
})

app.get('/received_image', async(req, res) => {
    console.log("Llega del servidor, va hacia el cliente");
    await axios.get(urlG + "info_img")
    .then(function (response) {
        //base64_decode(response.data.img, 'ho.png')
        //res.send(response.data.img);

        console.log(response.data.img)
        var image = base64_decode(response.data.img, '1.png')
        //res.sendFile("./1.png")
        //res.sendFile(path.join(__dirname, '../public', '1.png'));
        //res.sendFile('../public/1.png', {root: __dirname});
        //res.sendFile(path.resolve('public/1.png'));
        console.log("Se va a enviar")
        res.send(response.data.img)
        console.log("ya se envío")
    }).catch(function (error) {
        res.sendStatus(404);
        console.log("Error al enviar imagen");
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

  app.get('/send_email', (req, res) => {
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.sendStatus(200)
  })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})