const express = require("express");
dbconnection=require('./mongoose');
const User=require('./model/userModel');
const Post=require('./model/postModel');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
var jwt = require('jsonwebtoken');
const app = express();
dbconnection();
app.use(cors());

app.use(express.json());

let secretKey="1234";
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Serve static files from 'uploads' directory
app.use('/uploads', express.static('uploads'));

app.post('/posts', upload.single('photo'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const photo = req.file.path; // Get the file path of the uploaded photo

        const newPost = new Post({ title, content, photo });
        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
}); 



 

 


app.get('/posts', authenticate ,async (req, res) => {
    try {
        const posts = await Post.find().populate('user');;
        console.log(posts)
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});








// register  newUser 
app.post('/user', async(req,res)=>{
try {
    console.log(req.body)
    const {name,email,password,phone}=req.body;
    const user=await User.findOne({email});
    // console.log(user)
    if(user){
        return res.status(400).json({
            message:"user is already register with this email"
        })
    }
    const newUser = await User.create({
                    name,
                    email,
                    password,
                    phone,
                });
             return res.status(200).json({
                    newUser,
                    message : 'User ctreated successfully'
                })} 
catch (error) {
    return res.status(500).json({
        message:"Internal server error!"
    })
}


});

// to get all users 
 
app.get('/all-users', authenticate,async(req,res)=>{
    try {
        const users= await User.find();
        if(users){
            res.status(200).json({
                users,
                message:'Users find successfuly!'
            })
        }else{
            res.status(400).json({
                message:'User not resgistered!'
            })
        }
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error!"
        })
    }
});

// get singel user 

app.get('/user/:id',authenticate, async(req,res)=>{
  
   try {
    const {id}= req.params;
    console.log(id)
    const user= await User.findById(id);
    console.log(user)
    if(user){
        res.status(200).json({
            user,
            message:'User find successfuly!'
        })
    }else{
        res.status(400).json({
            message:'User not register!'
        })
    }

   } catch (error) {
    return res.status(500).json({
        message:"Internal server error!"
    })
   }

});
 
//user delete api
app.delete('/deleteuser/:id', authenticate ,async(req,res)=>{
  try {
    let {id}=req.params;
 let user= await User.findOneAndDelete(id);
 if(user){
    res.status(200).json({
        user,
        message:"user is deleted!"
    })
 } else{
    res.status(400).json({
        message:"user  Not found!"
    })
}
  } catch (error) {
    return res.status(500).json({
        message:"Internal server error!"
    
  });
}});

// user update api 
app.put('/updateuser/:id', authenticate ,async(req,res)=>{
    try {
        const userId =req.params.id;
       const userdata= req.body
        console.log(userId);
       
const user = await User.findByIdAndUpdate(userId,userdata,
  {
    new : true
  }
)

if(!user) {
    return res.status(401).json({
        message :'returnj user not found'
    })
}
     
    return res.status(200).json({
     user,
    message:"ok"
})
    } catch (error) {
        return res.status(500).json({
            message : 'internal server error'
        })
    }
})

 



//  user login Api 

app.post('/login', async(req,res)=> {
try {
    //  console.log(req.body);
    const {email,password}=req.body;
    const logindetail= await User.findOne({email})
    console.log(logindetail)
    if(logindetail.email==req.body.email && logindetail.password==req.body.password){
        var token = jwt.sign({email:logindetail.email,id:logindetail.id},secretKey);
        res.status(200).json({
            logindetail,
            token,
            message:'user Login'
        })
    }else{
        res.status(400).json({
            message:"invalid Information "

        })
       
    }
    // if(!logindetail) {
    //     return res.status(404).json({
    //         message : 'User not found register first'
    //     })
    // }
    // token = jwt.sign({email : logindetail.email, id : logindetail._id}, secretKey);
    // console.log('tokrn.........', token);
    // return res.status(200).json({
    //      token,
    //     message : 'Logged in successfully',
    // })
} catch (error) {
    
     return res.status(500).json({
        
        message:"Internal server error!"
    })
}
})
 


 














 
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    // Check if the authorization header is present
    if (!authHeader) {
        return res.status(401).json({
            message: "Not logged In."
        });
    }

    // Extract token from the authorization header
    const token = authHeader.split(' ')[1];

    // Check if the token is present
    if (!token) {
        return res.status(401).json({
            message: "Not logged In."
        });
    }

    // Verify the token
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach the decoded user info to the request object
        // console.log('Decoded user:', req.user); 
        next(); // Proceed to the next middleware
    } catch (err) {
        return res.status(403).json({
            message: "Invalid token."
        });
    }
}


 

  app.get('/islogin_user', async(req,res)=>{
 
   try {
    let getuser = await User.findOne({email});

    if(getuser){
        res.status(200).json({
            getuser,
            message:" Get User sucessfully!"
        })
    }
    
   } catch (error) {
    res.status(500).json({
 message:"Internal server error!"

    })
   }
   
  })
 


const PORT = 3001;

app.listen(PORT, () => {
   console.log(`Server is running on PORT: ${PORT}`);
});
