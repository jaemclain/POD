const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');

// Parent Signup
router.post('/signup/parent', (req, res) => {
    console.log(req.body);
    db.Parent.create({
        first_name: req.body.parentFirst,
        last_name: req.body.parentLast,
        email: req.body.parentEmail,
        password: req.body.parentPassword,
        monday: req.body.monday,
        tuesday: req.body.tuesday,
        wednesday: req.body.wednesday,
        thursday: req.body.thursday,
        friday: req.body.friday,
    }).then(newUser => {
        req.session.user = {
            email: newUser.email,
            id: newUser.id
        }
        db.Pod.create({ ParentId: newUser.id })
            .then(newPod => {
                res.redirect("/parent")
            })
    }).catch(err => {
        console.log(err);
        res.status(500).send("Server error")
    })
})


// Teacher Signup
router.post('/signup/teacher', (req, res) => {
    db.Teacher.create({
        first_name: req.body.teacherFirst,
        last_name: req.body.teacherLast,
        email: req.body.teacherEmail,
        password: req.body.teacherPassword,
    }).then(newUser => {
        req.session.user = {
            email: newUser.email,
            id: newUser.id
        }
        res.redirect("/teacher")
    }).catch(err => {
        console.log(err);
        res.status(500).send("Server error")
    })
})

// Student Signup
router.post('/signup/student', (req, res) => {
    console.log(req.body)
    db.Student.create({
        first_name: req.body.studentFirst,
        last_name: req.body.studentLast,
    }).then(function(student){
        student.addPod(req.body.StudentId);
        res.json(true);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Server error")
    })
})

// Parent Login
router.post('/login/parent', (req, res) => {
    db.Parent.findOne({
        where: { email: req.body.parentEmail }
    }).then(user => {
        //check if user entered password matches db password
        if (!user) {
            req.session.destroy();
            return res.status(401).redirect("/error")

        } else if (bcrypt.compareSync(req.body.parentPassword, user.password)) {
            req.session.user = {
                email: user.email,
                id: user.id
            }
            return res.redirect("/parent")
        }
        else {
            req.session.destroy();
            return res.status(401).redirect("/error")
        }
    })
})


// Teacher Login
router.post('/login/teacher', (req, res) => {
    db.Teacher.findOne({
        where: { email: req.body.teacherEmail }
    }).then(user => {
        //check if user entered password matches db password
        if (!user) {
            req.session.destroy();
            return res.status(401).redirect("/error")

        } else if (bcrypt.compareSync(req.body.teacherPassword, user.password)) {
            req.session.user = {
                email: user.email,
                id: user.id
            }
            return res.redirect("/teacher")
        }
        else {
            req.session.destroy();
            return res.status(401).redirect("/error")
        }
    })
})


// Logout 
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect("/")
})

// Session 
router.get("/sessiondata", (req, res) => {
    res.json(req.session)
})



module.exports = router;