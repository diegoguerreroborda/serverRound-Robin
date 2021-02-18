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

function sendData(){
  var url = 'http://localhost:3050/send_image';
  var data = {username: document.getElementById("input_message").value};
  fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(data.username), // data can be `string` or {object}!
    headers:{
      'Content-Type': document.getElementById("input_message").value
    }
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => console.log('Success:', response));
  //loadDoc();
}


function loadDoc() {
  fetch('http://localhost:3050/received_image')
  .then(response => response.text())
  .then( 
      data => {
          console.log(data)
          document.getElementById("btnGet").innerHTML = data;
      }
  );
}
