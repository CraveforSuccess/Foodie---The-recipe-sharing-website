const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const md5 = require('md5')
const app = express();

var IngArr = []
var process_Arr = []
var name = ''
mongoose.set('strictQuery', true);
var id = '';
var Uname = '';
mongoose.connect("mongodb+srv://Foodie:Iamphenomenol1@cluster0.fyf56n7.mongodb.net/?retryWrites=true&w=majority")
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))

const Recipes = new mongoose.Schema({
    Email: { type: String },
    title: { type: String },
    Ingredients: { type: Array },
    Rec_process: { type: Array },
    Author: { type: String }
})
const User = new mongoose.Schema({
    UserName: { type: String, required: true },
    Email: { type: String, required: true },
    Password: { type: String, required: true },
})

const NewUser = mongoose.model("NewUser", User)
const NewRecipe = mongoose.model("NewRecipe", Recipes)
app.get('/', (req, res) => {
    res.render('index')
})

app.post('/Login', (req, res) => {
    id = req.body.email;

    console.log(id);
    NewUser.findOne({ Email: req.body.email })
        .then((foundUser) => {

            console.log("Found");
            console.log(foundUser);
            name = foundUser.UserName
            if (foundUser.Password === md5(req.body.password)) {

                NewRecipe.find({ Email: id })
                    .then((docs) => {
                        console.log(name);
                        console.log(docs);

                        res.render('Recipe', { RecipeArr: docs })
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        })
        .catch((err) => {
            console.log(err);
        })
})


app.get('/Login', (req, res) => {
    res.render('Login')
})

app.post('/Signup', (req, res) => {
    id = req.body.email
    Uname = req.body.name;
    const UserData = {
        UserName: req.body.name,
        Email: req.body.email,
        Password: md5(req.body.password)
    }

    NewUser.insertMany(UserData)
        .then(() => {
            console.log("Submitted Successfully");
            res.render('Recipe', { RecipeArr: [] })
        })
        .catch((err) => {
            console.log(err);
        })

})


app.get('/Signup', (req, res) => {
    res.render('Signup')
})


app.post('/AddRecipe', (req, res) => {
    console.log(id);
    console.log(Uname);
    var prc_str = req.body.process
    var str = req.body.ingredients;
    IngArr = str.split(",");
    process_Arr = prc_str.split(",")

    var Recipe_Data = {
        Email: id,
        title: req.body.title,
        Ingredients: IngArr,
        Rec_process: process_Arr,
        Author: Uname
    }
    NewRecipe.find({}, { Email: id })
        .then(() => {

            NewRecipe.find({ Email: id }, Recipe_Data)
                .then(() => {
                    NewRecipe.insertMany(Recipe_Data)
                        .then((docs) => {
                            console.log(docs);
                            res.redirect('/')
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        })
})

app.post('/Browse', (req, res) => {
    NewRecipe.find({ title: req.body.searchBox })
        .then((recipe) => {
            console.log(recipe);
            res.render('Browse', { RecipeArr: recipe })
        })
        .catch((err) => {
            console.log("Error");
        })
})

app.get('/AddRecipe', (req, res) => {
    res.render('Addrecipe')
})
app.get('/Recipe', (req, res) => {
    res.render('Recipe', { RecipeArr: [] })
})
// app.get('/Recipe', (req, res) => {
//     res.render('Recipe')
// })
app.get('/Browse', (req, res) => {
    res.render('Browse', { RecipeArr: [] })
})
app.listen(3000, () => {
    console.log("Running");
})