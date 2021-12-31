if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}


const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
//const ejsMate = require('ejs-mate');
const session = require('express-session');
const bodyParser = require('body-parser');
const Book = require('./models/bookStore');
const User = require('./models/userSchema');
const Order = require('./models/order');
const Admin = require('./models/adminSchema');
const multer  = require('multer');
const {storage,cloudinary} = require('./cloudinary/index');
const upload = multer({ storage });


const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');


mongoose.connect('mongodb://localhost:27017/book-worm',{
    useNewUrlParser: true,
   // useCreateIndex: false,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});


const app = express();
const path = require('path');
//const res = require('express/lib/response');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'));

const sessionconfig={
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7

    }
}
app.use(session(sessionconfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


//app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
///////////////////////////////////////////////////////////////
// async function  registerAdmin(){
//     const username1 = "superAdmin";
//     const password1 = "superpassword";
//     const tempAdmin1 = new Admin({username1});
//     await Admin.register(tempAdmin1,password1);

//     const username2 = "superAdmin";
//     const password2 = "superpassword";
//     const tempAdmin2 = new Admin({username2});
//     await Admin.register(tempAdmin2,password2);

// }
// registerAdmin();
//////////////////////////////////////////////////////////////

cloudinary.config({ 
    cloud_name: 'dbkmv79ja', 
    api_key: '944523858912582', 
    api_secret: 'xX_eYGGIcgW0Q0x06iIduULa1ng' 
  });



///////////////////////////////////////////////////////////////
app.get("/",async(req,res)=>{
    console.log(req);
    const book = await Book.find({});
    res.render('./books',{books:book});
   // res.render('./home')
})

app.get("/books/:id",async(req,res)=>{
    const {id} = req.params;
    const book1 = await Book.find({_id:id});
    //console.log(book1);
    const book = book1[0];
    res.render('./bookDetails',{book:book});
   // res.render('./home')
})
 

app.get('/home',(req,res)=>{
    res.render('./home')
})
//////////////////////////////////////////////////////////
//  ------------------------------------------------------------------------------- -->
app.get('/admin',async(req,res)=>{
    const book = await Book.find({});
    res.render('./admin/viewList', {books:book})
})

app.get('/admin/edit/:id',async(req,res)=>{
    const book = await Book.findById(req.params.id);
    res.render('./admin/editBook', {book:book})
})


app.get('/admin/addnew',(req,res)=>{
    console.log(req);
    res.render('./admin/admin')
})


app.post("/admin/addnew",upload.single('image'),async(req,res)=>{
  console.log(req.body);
  const temp = req.body;
  temp.imagePath=req.file.path;
  const tempBook = new Book(temp);
    await tempBook.save();
    res.redirect(`/books/${tempBook._id}`)})

app.put("/admin/edit/:id" ,async(req,res)=>{
    const {id} = req.params;
    //console.log(id);
    //console.log({...req.body});
    await Book.findByIdAndUpdate({_id : id},req.body,()=>{
        res.redirect(`/books/${id}`);
    });
     })  
app.delete("/admin/:id", async(req,res)=>{
  const {id} = req.params;
  await Book.findByIdAndDelete({_id : id}, res.redirect("/admin"));

})

app.get("/admin/orders",async(req,res)=>{
    const order = await Order.find({});
    res.render('./admin/orders', {orders:order})
})

// app.get("/admin/login",(req,res)=>{
//    res.render("./admin/adminlogin");
// })

// app.post("/admin/login",passport.authenticate('local',{failureRedirect:"/admin/login"}),async(req,res)=>{
//     //const {username,password} = req.body;
    
//     res.redirect("/admin");

// })


//////////////////////////////////////////////////////////////////////////////

app.get("/signup",(req,res)=>{
    res.render("./user/signUp");
})

app.get("/login",(req,res)=>{
    res.render("./user/login");
})

app.post("/login",passport.authenticate('local',{failureRedirect:"/login"}),(req,res)=>{
    res.redirect("/");
})


app.post("/signup",async(req,res)=>{
    const {name,username,password,mobile,address} = req.body;
    const tempUser = new User({name,username,mobile,address});
   // await tempUser.save();
    await User.register(tempUser,password);
    res.redirect("/");
})

app.get("/logout",(req,res)=>
{
    req.logOut();
    res.redirect("/")
})
/////////////////////////////////////////////////////////////////////////////////////////////
app.get("/buy/:id",async(req,res)=>{
    const {id} = req.params;
    if(!req.isAuthenticated()){
        res.redirect("/login");
    }
    const book = await Book.findById(id).exec();
    res.render("./review",{book: book, user:req.user});
})
app.get("/checkout/:id",async(req,res)=>{
    const {id} = req.params;
    if(!req.isAuthenticated()){
        res.redirect("/login");
    }
    console.log(req.user);
    const book = await Book.findById(id).exec();
    const tempOrder = new Order({customer:req.user,book:book,orderStatus:"placed",time:Date.now()});
   // const tempOrder = new Order({customer:"id1",book:"book._id",orderStatus:"placed",time:Date.now()});
    await tempOrder.save();
    res.send("order placed. Thank You");
   // res.render("./review",{book: book, user:req.user});
})

app.listen(4000,()=>{
    console.log("listening on server 4000");
})