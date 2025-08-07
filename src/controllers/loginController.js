import pool from '../../db/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signUp = async(req,res)=>{

  try {

    const {username, password} = req.body;
    if(!username || !password) {
      return res.status(400).json({isSuccess:false, message: 'All fields are required'});
    }
    const existingUser = await pool.query('SELECT * FROM users WHERE user_name = $1',[username]);
    const isUserexist = existingUser.rows[0];
    if(isUserexist) {
      return res.status(409).json({isSuccess:false, message:'User already exists'})
    }
    const hashedPassword = await bcrypt.hash(password, 16);
    const newUser = await pool.query(
      'INSERT INTO users (user_name, password) VALUES ($1,$2) RETURNING id',[username, hashedPassword]
    );
    console.log('newuser--->>',newUser);
    res.status(201).json({isSuccess: true, user:{id:newUser._id, username}});

  } catch (error) {

    res.status(500).json({message: 'Signup failed', error: error.message})
  }
}


export const login = async(req,res)=>{
  console.log('first')
  const {username,password} = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE user_name = $1',[username]  
    )
    const isUserExist = result.rows[0];
    if(isUserExist){
      const { user_name : dbUsername , password : dbPassword, id: dbId} = result.rows[0];
      const resp = await bcrypt.compare(password, dbPassword);
      if(resp) {
        const userDetail = await pool.query(
          'SELECT * FROM user_roles ur JOIN role r ON ur.role_id = r.id JOIN users u ON ur.user_id = u.id WHERE u.user_name = $1', [dbUsername]
        )
        const user_role = userDetail.rows[0].user_role;
        if(!user_role) throw new Error ('Role missing');
        const token = jwt.sign({user_id: dbId, user_name: dbUsername, role: user_role }, process.env.JWT_SECRET, {expiresIn: '5m'});
        res.json({isSuccess: true,token: token, user_id: dbId, user_name: dbUsername});
      }
    }
  } catch (error) {
    res.status(500).json({isSuccess:false,message: 'Signup failed', error: error.message})
  }
}
