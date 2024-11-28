const http=require("http");
const express =require("express");
const cors=require("cors")
const socketIO = require("socket.io");
const { log } = require("console");
const app=express();
 
const port =process.env.REACT_APP_ENDPOINT ||4500 ; 

const users=[{}]

//||process.env.PORT;

 app.use(cors());
 app.get("/",(req,res)=>{
   res.send("HELLo ITS WORKING");
 })



const server=http.createServer(app);
const io=socketIO(server);
io.on("connection",(socket)=>{
  console.log("New Connection");

  socket.on ('joined',({user})=>{
    users[socket.id]=user;  
    console.log(`${user} has joined`);
    socket.broadcast.emit('user joined',{user:"Admin",message:`${users[socket.id]} has joined`})
    socket.emit("welcome",{user:"Admin",message:` welcome to the chat, ${users[socket.id]}`})   
  });

socket.on('message',({message,id})=>{

  io.emit('sendMessage',{user:users[id],message,id})

})


socket.on("disconnect",()=>{
  if (users[socket.id]) {
    socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left`});
  
    console.log('emitted');
  }
    else{
    console.log("sth missing here");}
  console.log("user left");
});



});



server.listen(port,()=>{
    console.log(`Working on http://localhost:${port}`);
});