

$(document).ready(function(){

    $("#submitButton").click(function(event) {

    event.preventDefault();
        var username = $("#username").val();
        var password = $("#password").val();
        var email = $("#emailID").val();


        if(username == "" || password == "" || email == "") {

            $("#formValid").empty();
            $("#formNotValid").html("Please fill out all of the fields before submitting.")
           
        }

        else {
            console.log("THIS IS OUTSIDE DATA: " + username, password, email);

    
        var data = {

            username: username,
            password: password,
            email: email
        };

        console.log("this is the data: " + data);


        $.ajax({
            type: "POST",
            url: "sign-up",
            data: data,
            success: function(response) {
                console.log("WHAT THE FUUUUCK");
                console.log(response.username + response.password + response.email);
            }

        });

        $("#formNotValid").empty();
        $("#formValid").html("✔ Registration complete")

        
        console.log("this is the uysername: " + username);
    }
    
    });


    $("#loginButton").click(function(event) {
        
        var email = $("#inputEmail").val();
        var password = $("#inputPassword").val();

    
    });
});