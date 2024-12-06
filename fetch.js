var express = require("express");
var app = express();
var fs = require("fs");
var cors = require("cors");
var bcrypt = require("bcrypt");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/",(req,res)=>{

    res.send("server started");
})

app.post("/register", async(req, res) => {

    password = req.body.password;
    var salt = 10;

    var passwordhash = await bcrypt.hash(password,salt);
    console.log(passwordhash);

    reg_user=req.body;
    reg_user.password=passwordhash;

    fs.writeFile("db.json", JSON.stringify(reg_user), (err) => {
        if (err) {
            res.status(400).send({
                status: 400,
                message: "error while fetching"
            })
        }
        else {
            console.log(typeof reg_user);

            res.status(200).send({
                status: 200,
                message: "data has been registered successfully",
                data: {
                    username: reg_user.username,
                    password: reg_user.password
                }
            })
        }
    })
});

// app.post("/register", (req, res) => {

//     var reg_user = req.body;
//     console.log(reg_user);

//     fs.writeFile("db.json", JSON.stringify(reg_user), (err) => {
//         if (err) {
//             res.status(400).send({
//                 status: 400,
//                 message: "error while registering"
//             })
//         }
//         else {
//             res.status(200).send({
//                 status: 200,
//                 message: "data has been sent successfully",
//                 data: {
//                     username: reg_user.username,
//                     password: reg_user.password
//                 }
//             })
//         }
//     })
// })

app.post("/login", (req, res) => {

    console.log(req.body); //object

    var { username, password } =req.body;

    console.log(password)
   
    

    fs.readFile("db.json", "utf-8", async(err, data) => {

        console.log(typeof data) //string
        data = JSON.parse(data);

        if (err) {
            res.send(err.message)
        }
        else {
            console.log(data)
            var match = await bcrypt.compare(password,data.password);
            console.log(match);
            
            if ((username == data.username) && (match)) {
                console.log("correct data");
                res.send(true);
            }
            else{
                console.log("error getting");
                res.send(false);
            }
        }
    })


})

port = 3000;

app.listen(port, () => {
    console.log("server started");
})