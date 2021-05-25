const user = require('../models/user.schema')

exports.save = (req,res) =>{
    if(req.body.password === req.body.cpassword){
        user.findOne({},(err,data)=>{
            if(data)
                c = data.id + 1
            else
                c = 1
            let newUser = new user({
                id:c,
                email:req.body.email,
                name:req.body.name,
                password:req.body.password,
            })
        
            newUser.save((err,b)=>{
                if(err){
                    res.render('signup.ejs',{msg:'Email already exists'})
                }
                else{
                    console.log('1 record inserted')
                    res.redirect('/login')
                }
            })
        }).sort({id:-1})
    }else
        res.render('signup.ejs',{msg:'Password is not matching'})
}

exports.login=(req,res)=>{
    user.findOne({email:req.body.email}).exec((err,data)=>{
        if(data){
            if(req.body.password === data.password){
                req.session.userId = data.id
                res.redirect('/profile')
            }
            else
                res.render('login.ejs',{msg:'Wrong Password'})
        }
        else
            res.render('login.ejs',{msg:'Signup before login'})
        
    })
}

exports.profile=(req,res)=>{
    user.findOne({id:req.session.userId}).exec((err,data)=>{
        if(data)
            return res.render('index.ejs',{ name:data.name, id:data.id, email:data.email})
        
        else
            res.redirect('/')
    })
}

exports.logout=(req,res)=>{
    if(req.session){
        res.clearCookie('connect.sid')
        req.session.destroy((err)=>{
            if (err) {
				console.log('error')
			} else {
				return res.redirect('/');
			}
        })
    }
}