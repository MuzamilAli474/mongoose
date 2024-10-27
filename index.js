const express = require("express");
dbconnection=require('./mongoose')
const User=require('./model/userModel')
const cors = require('cors');
var jwt = require('jsonwebtoken');
const app = express();
dbconnection();
app.use(cors());

app.use(express.json());

let secretKey="1234";

// register  newUser 
app.post('/user', async(req,res)=>{
try {
    // console.log(req.body)
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
 
app.get('/all-users', async(req,res)=>{
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

app.get('/user/:id', async(req,res)=>{
    console.log("okkkkkkkkkkkkkkkkkkk")
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
app.delete('/deleteuser/:id',authenticate ,async(req,res)=>{
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
app.put('/updateuser/:id',authenticate ,async(req,res)=>{
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
    const logindetail= await User.findOne({email,password})
    // console.log(logindetail)
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
} catch (error) {
     return res.status(500).json({
        message:"Internal server error!"
    })
}
})
 
 
function authenticate(req,res,next){
    let authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1]; 
    if(!token){
      return res.status(401).json({
        message:"Not logged In."
      })
    }
        var decoded = jwt.verify(token, secretKey);
    
        req.user=decoded;
   
    next();
  }


 
  

  app.get('/islogin_user',authenticate, async(req,res)=>{
 
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
