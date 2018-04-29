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
        var data = {

            "username": username,
            "password": password,
            "email": email
        }


        $.ajax({
            type: "POST",
            url: "sign-up",
            data: data,

        }).done(function(response) {
            console.log(response);
        });

        $("#formNotValid").empty();
        $("#formValid").html("✔ Registration complete")

        console.log("this is the uysername: " + username);
    }
    
    });
})