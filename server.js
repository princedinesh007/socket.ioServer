const express =require('express');
const app=express();
const cors=require('cors');
const http=require('http');
const {Server} =require('socket.io');
const formatMessage=require('./message')


app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST'],
  credentials: true
}));



const PORT=3000;
const server =http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://dineshchitchat.netlify.app',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection',(socket)=>{
   
   socket.on('setUsername', (username) => {
    socket.username = username;
     io.emit("chatMessage", formatMessage('System', `${username} has joined the chat`,new Date().toLocaleTimeString()));
    
  });
  
    socket.on("chatMessage",(msg)=>{
          io.emit('chatMessage', formatMessage(socket.username, msg, new Date().toLocaleTimeString()));
    })
    
    socket.on('disconnect',()=>{
      if (socket.username) {
      io.emit("chatMessage", formatMessage('System', `${socket.username} has left the chat`,new Date().toLocaleTimeString()));
    }
    })
});

server.listen(PORT,()=>{
    console.log(`Server Started and running on PORT ${PORT}`)
})
