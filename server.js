require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path') 
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoStore = require("connect-mongo").default;
const passport = require('passport')
const Emitter = require('events')
const PORT = process.env.PORT || 3000

//Database connection
const url = 'mongodb://localhost/LPG';
mongoose.connect(url , { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true});
const connection = mongoose.connection;
connection.once('open' , () =>{
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...')
})


//session configuration
const mongoStore = MongoStore.create({
    mongoUrl: url,
    collectionName: "sessions",
  });
  
//event emmiter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)
  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      store: mongoStore,
      cookie: { maxAge: 1000 * 60 * 60 * 24 }, //cookie valid for 24 hours
    })
  );

//passport config
const passportInit = require('./app/cofig/passport')
const { Socket } = require('dgram')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//assets
app.use(express.static('public'))

// Global middlewares
app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web') (app)

const server = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

//socket
const io = require('socket.io')(server)

io.on('connection', (socket)=> {
  //join
 
  socket.on('join', (roomName)=> {
    console.log(roomName)
    socket.join(roomName)
  })
})

eventEmitter.on('orderUpdated', (data) =>{
  io.to(`order_${data.id}`).emit('orderUpdated',data)
})
