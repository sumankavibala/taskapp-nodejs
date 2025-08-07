import jwt from 'jsonwebtoken';

export const authenticateToken = async(req,res,next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null; 
  
    if(!token) {
      return res.status(401).json({isSuccess:false, message:'Access token missing'});
    }
  
    const response = jwt.verify(token, process.env.JWT_SECRET);
    req.role = response.role;
    req.userId = response.user_id;
    next();
    
  } catch (error) {
    console.log('error--->>',error);
    if(error.name === 'TokenExpiredError'){
      return res.status(401).json({ isSuccess: false, message: 'Invalid token' })
    }
  }
}
