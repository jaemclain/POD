const express = require('express');
const router = express.Router();
const db = require('../models');

router.get("/", (req, res) => {
    res.render("login", { user: req.session.user })
})
router.get("/signup/parent", (req, res) => {
    res.render("parentsignup", { user: req.session.user })
})

router.get("/parent",(req,res)=>{
    db.Pod.findAll({
        include: [db.Parent,db.Student]
    }).then(pods=>{
        const podsJson=pods.map(pod=>pod.toJSON());
        console.log(podsJson)
        res.render("parent",{parent: podsJson});
    })
})

router.get('/signup/teacher',function(req,res){
    res.render("teachersignup",{ user: req.session.user });
})

router.get("/teacher",(req,res)=>{
    db.Pod.findAll({
        include: [db.Parent,db.Student]
    }).then(pods=>{
        const podsJson=pods.map(pod=>pod.toJSON());
        console.log(podsJson)
        res.render("teacher",{teacher: podsJson});
    })
})

module.exports = router