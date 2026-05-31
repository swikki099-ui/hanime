import axios from 'axios'
import {config} from 'dotenv'

config()

export const client = axios.create({
  baseURL: 'https://watchhentai.net'
})