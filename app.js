require('dotenv').config() ;

const express = require('express') ; 
const ejs = require('ejs') ; 
const mongoose = require('mongoose') ; 
const app = express() ;

app.use(express.json()) ;
app.use(express.urlencoded());
app.set('view engine', 'ejs') ;
app.use(express.static("public")) ;

mongoose.connect(process.env.URI, {useNewUrlParser:true, useUnifiedTopology:true}) ; 

const userSchema = mongoose.Schema({
    name : String, 
    certno : {type :String , unique : true}, 
    certificate : String, 
    issueDate : Date, 
    issueOrg : String
}) ;

const User = mongoose.model("user", userSchema); 

app.get('/', function(req, res){
    res.render('index', {userPresent : false }) ;
}) ;

app.post("/" , function(req, res) {
    console.log(req.body) ;
    const formNumber = req.body.formNumber ; 
    User.find({certno : formNumber} , function(err, foundUser){
        if(err) {
            console.log(err);
        } else {
            if(foundUser) {
                console.log(foundUser.name);
                res.render('index', {userPresent : true, user : foundUser[0]}) ;
            } 
        }
    });
}) ;

app.get('/compose', function(req, res){
    res.render('compose',{error : ""}) ;
}) ;

app.post('/compose', function(req, res){
    let user = new User({
        name : req.body.name, 
        certno : req.body.certno, 
        certificate : req.body.cert, 
        issueDate : req.body.issueDate, 
        issueOrg : req.body.issueOrg
    });

    console.log(req.body);

    User.insertMany([user], function(err){
        if(err) {
            console.log(err);
            res.render('compose', {error :"Duplicate data"}) ;
        } else {
            res.redirect('compose');
        }
    });
}) ;

let port = process.env.PORT;
if (port == null)
    port = 3000;

app.listen(port, function() {
    console.log("server started at port 3000");
});