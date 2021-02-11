var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!'
    }
  })

  var app2 = new Vue({
    el: '#app-2',
    data: {
      message: 'You loaded this page on ' + new Date().toLocaleString()
    }
  })

  const sendData = () => {
    const urlPost = 'http://localhost:3001/send_image'
    var httpPost = new XMLHttpRequest();
    httpPost.onload = () =>{
        httpPost.responseText = "Hola mundoooo"
    } 
    httpPost.open("POST", urlPost);
    httpPost.setRequestHeader("Content-type", "aplication/x-www-form-urlencoded");
    httpPost.send()
};

function sendD(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3001/send_image", true);
    xhttp.setRequestHeader("Content-type", document.getElementById("input_message").value);
    //xhttp.set('Content-Type', 'text/plain')
    xhttp.send(); 
    loadDoc();
}

function loadDoc() {
    var jhttp = new XMLHttpRequest();
    jhttp.onreadystatechange = function() {
      if (this.status == 200) {
       document.getElementById("btnGet").innerHTML = this.responseText;
      }
    };
    jhttp.open("GET", "http://localhost:3001/received_image", true);
    jhttp.send();
}