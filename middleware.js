const express = require('express')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const cors = require('cors')
const app = express()
app.use(cors())
const port = 3001

var responseServer = "";
var requestImg = "";

//POST
const sendData = () => {
    const urlPost = 'http://localhost:3000/data_client'
    var httpPost = new XMLHttpRequest();
    httpPost.open("POST", urlPost);
    httpPost.send(requestImg)
};

//GET
const getDataImg = () => {
    const httpReq = new XMLHttpRequest()
    const url = 'http://localhost:3000/info_client'
    httpReq.open("GET", url)
    httpReq.onreadystatechange = function(){
        if(this.status == 200){
            console.log("Que pasa puta")
            console.log(this.responseText) 
            responseServer = this.responseText
        }
}
httpReq.send()
};

app.get('/received_image', (req, res) => {
    getDataImg();
    res.send(responseServer)
  })

app.post('/send_image', (req, res) => {
    console.log("llega del cliente")
    console.log(req.header('Content-type'))
    requestImg = req.header('Content-type')
    sendData();
  });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})