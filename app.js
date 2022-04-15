const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const jsonParser = express.json();
const app=express();

const userScheme = new Schema({name: String, age: Number}, {versionKey: false});
const User = mongoose.model("User", userScheme);

const Port=process.env.PORT||80

//Mongodb
const db='mongodb+srv://Tonukok:test@cluster0.mmmsu.mongodb.net/test?retryWrites=true&w=majority';

    mongoose
    .connect(db)
    .then((res) => console.log('Connected to db'))
    .catch((error)=> console.log(error));


const createPath=(page)=>path.resolve(__dirname,'view',`${page}.html`);
app.use(express.static(__dirname + '/'));

app.listen(Port,(error)=> {
    error ? console.log(error) : console.log(`linting port ${Port}`)
});

app.get('/',(req, res) =>
{
    res.sendFile(createPath('index'));
});
app.get('/index.html',(req, res) =>
{
    res.sendFile(createPath('index'));
});

app.get('/create.html',(req, res) =>
{
    res.sendFile(createPath('create'));
});

    app.get("/api/users", function(req, res){

        User.find({}, function(err, users){

            if(err) return console.log(err);
            res.send(users)
        });
    });


    app.put("/api/users", jsonParser, function(req, res){

        if(!req.body) return res.sendStatus(400);
        const id = req.body.id;
        const userName = req.body.name;
        const userAge = req.body.age;
        const newUser = {age: userAge, name: userName};

        User.findOneAndUpdate({_id: id}, newUser, {new: true}, function(err, user){
            if(err) return console.log(err);
            res.send(user);
        });
    });
        app.delete("/api/users/:id", function(req, res){

            const id = req.params.id;
            User.findByIdAndDelete(id, function(err, user){

                if(err) return console.log(err);
                res.send(user);
            });
        });
        app.post("/api/users", jsonParser, function (req, res) {

            if(!req.body) return res.sendStatus(400);

            const userName = req.body.name;
            const userAge = req.body.age;
            const user = new User({name: userName, age: userAge});

            user.save(function(err){
                if(err) return console.log(err);
                res.send(user);
            });
        });



