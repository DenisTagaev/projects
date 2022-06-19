'use strict';
//import required files
import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
// import path from "path";

//configure server
const app = express();
const PORT = process.env.PORT || 3000;

//declare middleware files to use
app.use('/scripts', express.static('./scripts'));
app.use('/styles', express.static('./styles'));
app.use(bodyParser.json());

//configure requests to serve
//set initial load page
app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));

//set post requests handler
app.post('/users', (request, response) => {
    let operation_status;

    //check if the user is new
    if (!fs.existsSync(`users/${request.body.id}.txt`)) {
        //create a txt file and write input data into it
        fs.writeFile(`./users/${request.body.id}.txt`,
            JSON.stringify(request.body), (err) => {
                //check for errors while creating a file
                if (err) {
                    operation_status = err;
                    console.log(operation_status);
                    response.send(JSON.stringify(operation_status));
                } else {
                    //on successful creation inform admin and send confirmation to browser 
                    console.log('Write operation complete.');
                    operation_status = '200';
                    // console.log(operation_status);
                    response.send(operation_status);
                }
            });
    } else { //reply that user is already created
        operation_status = 'Write operation failed, user already exists';
        console.log(operation_status);
        response.send(JSON.stringify(operation_status));
    }
});

//listen for updates request
app.put('/users', (req, res) => {
    let operation_status;

    if (fs.existsSync(`users/${req.body.id}.txt`)) {
        //if exists rewrite file data
        fs.writeFile(`./users/${req.body.id}.txt`,
            JSON.stringify(req.body), (err) => {
                //check for errors while creating a file
                if (err) {
                    operation_status = err;
                    console.log(operation_status);
                    res.send(JSON.stringify(operation_status));
                } else {
                    //on successful creation inform admin and send confirmation to browser 
                    console.log('Update operation complete.');
                    operation_status = '200';
                    res.send(operation_status);
                }
            });
    } else { //reply that user data is missing
        operation_status = 'Update operation failed, no user present';
        console.log(operation_status);
        res.send(JSON.stringify(operation_status));
    }
});


//listen for delete requests
app.delete('/users', (req, res) => {
    let operation_status, id = req.query.id;

    //check if the user exists
    if (fs.existsSync(`users/${id}.txt`)) {
        //delete file if exists
        fs.unlinkSync(`users/${id}.txt`);
        console.log('Delete operation complete.');
        operation_status = '200';
        res.send(operation_status);
    } else { //reply that no user  found 
        operation_status = 'Delete operation failed, user is not found';
        console.log(operation_status);
        res.send(JSON.stringify(operation_status));
    }
});


//listen for request to retrieve user's information
app.get('/users', (req, res) => {
    let data, user = req.query.id;

    if (!fs.existsSync(`users/${user}.txt`)) {
        let error = 'No customer exists against provided data';
        res.send(JSON.stringify(error));
    } else {
        data = JSON.parse(fs.readFileSync(`users/${user}.txt`, 'utf8'));
        res.send(data);
    }

})

//run the server on configured port
app.listen(PORT, function() {
    console.log("Server is running on port " + PORT);
});