import express from "express";
import { config } from 'dotenv'
config({path:'./config/config.env'})
const app=express()
import { intiateapp } from "./src/intiate-app.js";


intiateapp(app,express)
