//import express, { Router } from "express";
//import path from "path";
//
//export let passwordRouter = Router();
//
//passwordRouter.use(express.static("protected")); //read the html and css file , sequence is matter, public guy watch public
//passwordRouter.use(express.urlencoded({ extended: true })); //middleware for html-form-post
//passwordRouter.use(express.json());
//
//passwordRouter.get('/changepassword', (req,res) => {
//    res.sendFile(path.resolve("protected","changepassword.html"))
//})
//
//passwordRouter.post('/', async (req,res) => {
//    console.log('hi: ', req.body)
//    let employeeName = req.body.employeeName;
//    let email = req.body.email;
//    let currentPassword = req.body.currentPpassword;
//    let newPassword = req.body.newPassword;
//    let rePassword = req.body.rePassword;
//    console.log(employeeName, email, currentPassword, newPassword, rePassword)
//
//    async function insertQuery(){
//        if(employeeName.length < 2){
//            console.log('invalid Employee Name')
//           res.json({error: 'invalid Employee Name'})
//            return
//        }
//        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false){
//            console.log('invalid email')
//            res.json({error: "invalid email"})
//            return
//        }
//        if(currentPassword.length < 6){
//            console.log('invalid password')
//            res.json({error: "invalid password"})
//            return
//        }
//        if(newPassword.length < 8){
//            console.log('invalid Phone Number')
//            res.json({error: "invalid Phone Number"})
//            return
//        }
//        if(currentPassword.length < 8){
//            console.log('invalid Department Info')
//            res.json({error: "invalid Department Info"})
//            return
//        }
//
//
////        let result = await demo()
////        console.log(result);
////    await client.query(
//
//        `
//        insert into employee (name, email, password, phone_number, role, hire_date, department_id) values ($1,$2,$3,$4,$5,$6,$7)
//        `, [employeeName, email, result, phoneNumber, role, hireDate, departmentId]
//    )
//    res.json({error: ""})
//
//    await client.end();
//    console.log('done')
//}
//insertQuery()
//})
//
