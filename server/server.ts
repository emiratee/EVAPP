import cors from 'cors'
import express from 'express'
import router from './routers/router'

export const createServer = () => {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(router)

  return app
}