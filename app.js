require('dotenv').config()
const path = require('path')

// set project root path
global.rootPath = path.join(__filename, '../')

const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

const logger = require('./src/modules/logger')

const allowedOrigins = require('./src/constants/allowed-origins')
const { REQUEST_TIMEOUT } = require('./src/constants/timers')

const routes = require('./src/routes')

const app = express()

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? allowedOrigins : '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  exposedHeaders: ['WWW-Authenticate']
}

// helmet
app.use(helmet())

// disable http trace
app.use((req, res, next) => {
  if (req.method === 'TRACE') {
    return res.status(405).send('Not allowed')
  }
  next()
})

// cors
app.use(cors(corsOptions))

// timeout requests
app.use((req, res, next) => {
  req.setTimeout(REQUEST_TIMEOUT, () => {
    res.set('Connection', 'close')
    return res.status(408).send('Request timed out')
  })
  next()
})

// cookie parser
app.use(cookieParser())

app.use([
  bodyParser.json({ limit: '250kb' }),
  bodyParser.urlencoded({ extended: false }),
])

app.use(logger)

// enable pre-flight
app.options('*', cors(corsOptions))

// add routes
app.use('/', routes)

// missing route handler
app.use('*', (req, res) => {
  return res.status(404).send('Not found')
})

// error handler
app.use((err, req, res, next) => {
  console.error({
    message: err.message,
    stack: err.stack,
    type: 'error',
  })
  return res.status(400).send({
    message: err.message,
    type: 'error',
  })
})

process.on('unhandledRejection', err => {
  console.error({
    message: err.message,
    stack: err.stack,
    type: 'unhandled rejection',
  })
})

process.on('uncaughtException', err => {
  console.error({
    message: err.message,
    stack: err.stack,
    type: 'uncaught exception',
  })
  process.exit(1)
})

process.on('SIGINT', () => {
  console.log('SIGINT .. exiting process')
  process.exit(0)
})

app.listen(process.env.PORT, () => {
  console.log(`started at port: ${process.env.PORT}`)
})
