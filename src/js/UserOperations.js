function login(username, password) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "username": username,
        "password": password
    })

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    }

    var failure;
    fetch("http://pana-api1.herokuapp.com/api/login_check", requestOptions)
        .then(response => response.text())
        .then(result =>localStorage.setItem("token",JSON.parse(result)["token"]))
        .catch(error => failure = error)
    
    if(failure == null){
        
        setTimeout(function () {
            location.replace("location.replace("https://pana2.vercel.app/map")
        }, 1000);
    }
}

function signUp(username, password) {
    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "username": username,
  "password": password
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://pana-api1.herokuapp.com/api/admins/register", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}

function formSubmitReplace(){
    document.forms[0].addEventListener("submit", e => {
        e.preventDefault();
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        switch (document.getElementById("type").value) {
            case 'login':
                login(username, password);
                break;
            case 'signup':
                signUp(username, password)
                break;
        }

    })
}
window.onload = function () {

    if(document.forms[0]!=undefined) {
        formSubmitReplace();
    }
    
}


