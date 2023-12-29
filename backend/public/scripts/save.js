const express = require('express'); 
const app =express()
var fs = require ('fs'); 

// middleware  

app.use(express.urlencoded({extended:true})) 

// STEP 1: Read the existing data from json file  

let users= require("./message.json")

// API routes 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  }) 
     
app.post("/",function(req,res){ 
   
    let car = req.body.car;
    let model = req.body.model;
    
    // new car 
    let formData = {
        car: car,
        model: model
    } 

    res.send(formData)  

    // STEP 2: add new user data to users object using push method  
   users.push(formData) 

   // STEP 3: Writing data in a JSON file 

   fs.writeFile('message.json', JSON.stringify(users), err =>{ 
     if(err) throw err 

     console.log("Done writting JSON file")
   }) 

   // STEP 4: Write the new info in the text file named message

  fs.writeFile('./message.txt',JSON.stringify(users), err =>{ 
    if(err) throw err 

    console.log("Done writting text file")
  }); 
  });  

  app.listen(3000, function(){ 
      console.log("server started on port 3000")
  })