const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express();
app.use(express.json());
app.use(express.urlencoded(({ extended: true })));
app.use(cors());
dotenv.config();

mongoose.connect(process.env.Mongodb_Url).then(() => {
    console.log("connection is succesfully")
}).catch((err) => {
    console.log(err)
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

//Routes
app.post("/login", (req, res) => {
    const { email, password } = req.body
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            if (password === user.password) {
                res.send({ message: "Login Successfull", user: user })
            } else {
                res.send({ message: "Password didn't match" })
            }
        } else {
            res.send({ message: "User not registered" })
        }
    })
})

app.post("/register", async (req, res) => {

    const { name, email, password } = req.body

    try {

        useExist = await User.findOne({ email: email });
        if (userExsit) {
            res.send({ message: "this email already exit" });
        }
        else {
            const user = new User({
                name,
                email,
                password
            })
            console.log(user)

            await user.save();
            res.send("user register succesfully")
        }

    } catch (err) {
        console.log(err)
    }

})

app.listen(9002, () => {
    console.log("BE started at port 9002")
})