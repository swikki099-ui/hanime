import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { router } from './routers/index.js';

config();

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static('public'))

app.use('/', router)

app.listen(5050, () => {
  console.log('Server running on port http://localhost:5050')
})