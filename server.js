 
// redis example
var express = require('express');
var http = require('http');
var redis = require('redis');
var JSON = require('JSON');
client = redis.createClient(6379,'127.0.0.1');

var app = express();
var server = http.createServer(app);

server.listen(8082, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
 
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(function(req,res,next){
      req.cache = client;
      next();
})

app.post('/profile',function(req,res,next){
      console.log(req.body);
      req.accepts('application/json');
     
      var key = req.body.name;
      var value = JSON.stringify(req.body);
     
      req.cache.set(key,value,function(err,data){
           if(err){
                 console.log(err);
                 res.send("error "+err);
                 return;
           }
           req.cache.expire(key,1000);
           res.json(value);
           //console.log(value);
      });
})

app.get('/profile/:name',function(req,res,next){
      var key = req.params.name;
     
      req.cache.get(key,function(err,data){
           if(err){
                 console.log(err);
                 res.send("error "+err);
                 return;
           }
 
           var value = JSON.parse(data);
           res.json(value);
           
           console.log(value);
      });
});