import express from'express'
import bootstrap from './app.controller.js'

console.log("Server starting...");
const app = express()
console.log("Calling bootstrap...");
await bootstrap(app,express)
console.log("Bootstrap completed!");