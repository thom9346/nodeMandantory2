

const main = require('../app.js');
const chai = require('chai');
const mongoose = require('mongoose');
const assert = chai.assert;
const expect = chai.expect;




describe('Test msg schema functionality', function(){
    it('should pass if the msg provided in testMsg is correct', function(done){
        var testMsg = ({
            nick: "TestUser200",
            msg: "This is a test message from my test.js file"
        });

       console.log(main.model(testMsg));
       done(); 
    });
});


