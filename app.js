const { response } = require('express');
const express = require('express');
const morgan = require('morgan');
const mongoose = require ('mongoose');

const Blog = require('./models/blog.js');


const app = express();

const dbURI = "mongodb+srv://aravindpk:aravind1245@webed.lzy6t.mongodb.net/webed?retryWrites=true&w=majority";


mongoose.connect( dbURI,  { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(process.env.PORT || 5000)
        console.log("database connected , server running")
    })
    .catch(err => console.log(err));



//set ejs as view engine
app.set('view engine', 'ejs');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
// middleware & static files
app.use(express.static('public'));
//url parser
app.use(express.urlencoded({ extended: true }));
//morgan logger
app.use(morgan('dev'))



//all blogs page
app.get('/', (req, res) => {


    Blog.find().sort({ createdAt: -1 })
        .then(result => {
            res.render('index', {title:'Home',blogs:result});
        })
        .catch(err => console.log(err));


});


//editor page
app.get('/editor', (req, res) => {



    Blog.find()
        .then(result => {
            res.render('editor', {title:'Editor',blogs:result});
        })
        .catch(err => console.log(err));
});


//single blog page
app.get('/blog', (req, res) => {

    res.render('blog',{title:"blog" });
});


app.get('/blog/:id',(req,res) =>{
    const id = req.params.id;
    Blog.findById(id)
        .then(result =>{
            console.log(result);
            res.render('blog', {title:'blog',blog: result});
        })
})


//new blog.................................................................


app.get('/create', (req, res) => {
    res.render('create',{title:"blogtitle"});
});

app.post('/create',(req,res) =>{
    console.log('postreq received ,', req.body);

    const blog = new Blog(req.body);

    blog.save()
        .then(result =>{
            res.redirect(`/blog/${result._id}`);
        })
        .catch(err => console.log(err));

})

//delete blog .................................................................


app.delete('/blog/:id' , (req,res)=>{

    const response = {
        status:'success',
        redirect:'/editor'
    }

    Blog.findByIdAndDelete(req.params.id)
        .then(result =>  res.json(response))
        .catch(err => console.log(err));
})

//edit blog.....................................................................


//edit get


app.get('/blog/edit/:id' , (req,res)=>{

    const id = req.params.id;
    Blog.findById(id)
        .then(result =>{
            res.render('edit', {title:'blog',blog: result});
        })

})

//edit put

app.post('/blog/edit/:id',(req,res)=>{

    const response = {
        status:'success',
        redirect:'/editor'
    }

    console.log(req.body);

    Blog.findByIdAndUpdate(req.params.id , req.body)

        .then( result => res.redirect(`/blog/${result._id}`))
        .catch(err => console.log(err));

})













//404 page ................................................................
app.use((req,res) =>{
    res.status(404).send("Oops page not found :)");
})




