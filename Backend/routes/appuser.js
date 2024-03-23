const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
require('dotenv').config();
var auth = require('../services/authentication')



router.post('/addNewAppuser',auth.authenticateToken,(req, res) => {
    let user = req.body;
    var query = 'SELECT email, password, status FROM appuser WHERE email = ?';
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "INSERT INTO appuser(name, email, password, status, isDeletable) VALUES (?, ?, ?, 'false', 'true')";
                connection.query(query, [user.name, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: 'Successfully registered' });
                    } else {
                        return res.status(500).json(err);
                    }
                });
            } else {
                return res.status(400).json({ message: 'Email already exists' });
            }
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post('/login', (req, res)=>{
    const user = req.body;
    query = "select email,password,status,isDeletable from appuser where email=?";
    connection.query(query,[user.email],(err,results)=>{
        if(!err){
           if(results.length <=0 || results[0].password!=user.password){
            return res.status(401).json({message:"Incorrect Email or Password"});
           } else if(results[0].status === 'false'){
            return res.status(401).json({message:'wait for admin Approval'});
           }
           else if(results[0].password === user.password){
            const response = {email:results[0].email,isDeletable:results[0].isDeletable}
            const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN,{expiresIn:'8h'})
            return res.status(200).json({token:accessToken})
           }
           else{
            return res.status(400).json({message:'Something went wrong please try again later'})
           }
        }else{
            return res.status(500).json(err)
        }
    })
})

router.get('/getAllAppUser',auth.authenticateToken, (req,res)=>{
    const tokenPayload = res.locals;
    var query;
    if(tokenPayload.isDeletable === 'false'){
        query = "select id, name, email, status from appuser where isDeletable='true'";
    }else{
        query = "select id, name, email, status from appuser where isDeletable='true' and email !=?";
    }
    connection.query(query,[tokenPayload.email],(err,results)=>{
        if(!err){
            return res.status(200).json(results)
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.post('/updateUserStatus',auth.authenticateToken,(req,res)=>{
    let user = req.body;
    var query= "update appuser set status =? where id=? and isDeletable='true'";
   connection.query(query,[user.status,user.id],(err,results)=>{
    if(!err){
        if(results.affectedRows == 0){
            return res.status(404).json({message:"User ID does not exist"});
        }
        return res.status(200).json({message:"User Updated Successfully"});
    }else{
        return res.status(500).json(err);
    }
   })

})

router.post('/updateUser',auth.authenticateToken,(req,res)=>{
    let user = req.body;
    var query= "update appuser set name =?, email=? where id=?";
   connection.query(query,[user.name,user.email, user.id],(err,results)=>{
    if(!err){
        if(results.affectedRows == 0){
            return res.status(404).json({message:"User ID does not exist"});
        }
        return res.status(200).json({message:"User Updated Successfully"});
    }else{
        return res.status(500).json(err);
    }
   })
})

router.get('/checkToken',auth.authenticateToken,(req,res)=>{
    return res.status(200).json({message:'true'})
})



module.exports = router;
