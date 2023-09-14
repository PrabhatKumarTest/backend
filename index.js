// Import Modules 
const express = require('express')
var cors = require('cors')

// function Imports
// functiont to connect with MongoDB
const connectToMongo = require('./connectToMongo');
// function which connects to MongoDB
connectToMongo()

// Creating app from
const app = express()
const port = 5000

// middleWare 
app.use(express.json())
app.use(cors())


//  API calls
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Router API Calls
app.use('/api/auth', require('./routes/auth'))
app.use('/api/pass', require('./routes/pass'))


// App Running on 
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

