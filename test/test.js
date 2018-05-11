

const main = require('../app.js');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

const mongoose = require('mongoose');
const assert = chai.assert;
const expect = chai.expect;



chai.use(chaiHttp);

// describe('Test msg schema functionality', function(){
//     it('should pass if the msg provided in testMsg is correct', function(done){
//         var testMsg = ({
//             nick: "TestUser200",
//             msg: "This is a test message from my test.js file"
//         });

//        console.log(main.model(testMsg));
//        done(); 
//     });
// });

describe('/GET chat page', () => {
    it('should return an error of status 401, since youre not logged in', (done) => {
        
        chai.request(main) 
        .get('/chat')
        .end((err, res) => {
            res.should.have.status(401);
            done();
        });
    })
      
   
});




