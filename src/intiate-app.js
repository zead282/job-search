import { DB_Connection } from "../DB/connection.js"
import { glopalresponse } from "./Middlewares/glopal-response.js"
import * as routers from './Modules/index.routes.js'


export const intiateapp=(app,express)=>{

      const port=process.env.PORT

      app.use(express.json())
      
      DB_Connection()

      app.use('/user',routers.usertrouter)
      app.use('/company',routers.companyrouter)
      app.use('/application',routers.applicationrouter)
      app.use('/job',routers.jobrouter)


      app.use(glopalresponse)
      app.listen(port,()=>console.log(`app listen on port ${port}`))

}