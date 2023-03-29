import express, { Router } from "express";
import path from 'path';
import { client } from './db';
import Swal from 'sweetalert2';
//import expressSession from "express-session";
export let registerRouter = Router();

registerRouter.use(express.static("protected")); //read the html and css file , sequence is matter, public guy watch public
registerRouter.use(express.urlencoded({ extended: true })); //middleware for html-form-post

registerRouter.get('/adduser', (req,res) => {
    res.sendFile(path.resolve("protected","adduser.html"))
})

//registerRouter.post('/adduser', (req,res) => {
//    console.log('hi: ', req.body)
//    let employeeName = req.body.employeeName;
//    let email = req.body.email;
//    let password = req.body.password;
//    let phoneNumber = req.body.phoneNumber;
//    let role = req.body.role;
//    let hireDate = req.body.hireDate;
//    let departmentId = req.body.departmentId;
//    console.log(employeeName, email, password, phoneNumber, role, hireDate, departmentId)
//})

registerRouter.post('/adduser', async (req,res) => {
    console.log('hi: ', req.body)
    let employeeName = req.body.employeeName;
    let email = req.body.email;
    let password = req.body.password;
    let phoneNumber = req.body.phoneNumber;
    let role = req.body.role;
    let hireDate = req.body.hireDate;
    let departmentId = req.body.departmentId;
    console.log(employeeName, email, password, phoneNumber, role, hireDate, departmentId)
    async function insertQuery(){
        if(employeeName.length < 2){
            console.log('invalid Employee Name')
           // res.json({error:true})
            return
        }
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false){
            console.log('invalid email')
            return
        }
        if(password.length < 6){
            console.log('invalid password')
            return
        }
        if(phoneNumber.length <8){
            console.log('invalid Phone Number')
            return
        }
        if(departmentId.length > 3){
            console.log('invalid Department Info')
            Swal.fire('hi');
            return
        }
        
    let newEmployee = await client.query(

        `
        insert into employee (name, email, password, phone_number, role, hire_date, department_id) values ($1,$2,$3,$4,$5,$6,$7)
        `, [employeeName, email, password, phoneNumber, role, hireDate, departmentId]
    )
    console.log(newEmployee)

    await client.end();
    console.log('done')
}
insertQuery()
})
