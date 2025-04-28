import express from 'express';
import AuthController from '../Controller/Auth.js'
import verifyToken from '../MiddleWare/AuthMiddleware.js';
import AutherisedRoles from '../MiddleWare/RoleMiddleWare.js';

const routes = express.Router();

routes.post("/AddRole", AuthController.RegisterRoles);
routes.post("/Login", AuthController.Login);

// routes.get("/Admin" ,verifyToken,AutherisedRoles("user"),(req, res)=>{
//     console.log("hello admin");
//     res.status(200).json({status:true})
    
// });
// routes.get("/Manager" ,verifyToken,AutherisedRoles("manager"), (req, res)=>{
//     console.log("hello manager");
//     res.status(200).json({status:true})
    
// })


export default routes