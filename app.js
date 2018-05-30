var bodyParser  = require('body-parser'),
    methodOverride= require('method-override'), 
    express     = require('express'),
    expressSanitizer = require('express-sanitizer')
    mongoose    = require('mongoose'),
    app         = express();

//APP CONFIG    
mongoose.connect('mongodb://localhost/restful_blog_app');
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
// MODEL CONFIG
var blogSchema = new mongoose.Schema(
{
    //title
    title:   String,
    image:   String,
    body:    String,
    created:  {type:Date , default: Date.now}  
});
var Blog =mongoose.model("Blog",blogSchema);
// Blog.create(
//     {
//         title: "test blog",
//         image: "https://siberianhusky.com/wp-content/uploads/2016/09/puppyy11.jpg",
//         body: "HELLO THIS IS A BLOG TEXT" 
//     });


//RESTFUL ROUTES
app.get('/',function(req,res)
{
     res.redirect('/blogs');
});
//Index Route
app.get('/blogs',function(req,res)
{
    Blog.find({},function(err,blogs)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render('index',{blogs: blogs})
        }
    });
});
//New ROUTE
app.get('/blogs/new',function(req,res)
{
   res.render('new');
});
//CREATE ROUTE
app.post('/blogs',function(req,res)
{
    //body sanitizeing
    req.body.blog.body=req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog,function(err, newBlog)
    {
        if(err)
        {
            res.render('new');
        }
        else
        {
             res.redirect('/blogs');
        }
    });

});
//show Route
app.get('/blogs/:id',function(req,res)
{
    Blog.findById(req.params.id,function(err,foundBlog)
    {
        if (err) 
        {
             res.redirect('/blogs');
        }
        else
        {
            res.render('show',{blog: foundBlog});
        }
    }); 
});

//EDIT ROUTE
app.get('/blogs/:id/edit',function(req,res)
{
    Blog.findById(req.params.id,function(err,foundBlog)
    {
        if (err) 
        {
             res.redirect('/blogs');
        }
        else
        {
            res.render('edit',{blog: foundBlog});
        }
    });
});

//UPDATE ROUTE

app.put('/blogs/:id',function(req,res)
{
    req.body.blog.body=req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog)
    {
        if (err) 
        {
             res.redirect('/blogs');
        }
        res.redirect('/blogs/'+ req.params.id) 
    });
});

//DELETE ROUTE
app.delete('/blogs/:id', (req, res) =>
{
    //destroy item by id
    Blog.findByIdAndRemove(req.params.id,function(err,blog2Delete)
    {
        if(err)
        {
            console.log(err);
            res.redirect('/blogs');
        }
        else
        {
            console.log(`${blog2Delete} has been deleted successfully..!`);
            console.log(`-------------------------------------------------------------------`);
             res.redirect('/blogs');
        }
        
    });    
});



var port =3000;
app.listen(port,function()
{
    console.log("The App has started working on port 3000")
});
