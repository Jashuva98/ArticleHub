const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');


router.post("/addNewCategory", auth.authenticateToken,(req,res)=>{
    let category = req.body;
    query = "insert into category (name) values(?)";
    connection.query(query,[category.name],(err, results)=>{
        if(!err){
            return res.status(200).json({message:"category added successfully"});
        }else{
            return res.status(500).json(err);
        }
    })
})

router.get('/getAllCategory', auth.authenticateToken,(req,res)=>{
    var query = "select * from category order by name";
    connection.query(query, (err,results)=>{
        if(!err){
            return res.status(200).json(results)
        }else{
            return res.status(500).json(err);
        }
    })
})

router.post("/updateCategory",auth.authenticateToken,(req,res)=>{
    let category = req.body;
    var query = "update category set name =? where id=?";
    connection.query(query,[category.name,category.id],(err, results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Category id does not found"})
            }
            return res.status(200).json({message:"category updated successfully"});
        }
    })
})

module.exports = router;