document.getElementById("loginForm").addEventListener("submit",function(e){
    e.preventDefault();

    const username = document.getElementById("username").Value;
    const password = document.getElementById("password").Value;

    if(username === "admin" && password === "admin123"){
        alert("Invalid Username or Password");
    } else{
        alert("Login Successful!");
    }

});
