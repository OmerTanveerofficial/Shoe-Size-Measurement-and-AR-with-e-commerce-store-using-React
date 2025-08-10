import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.json({
        success: false,
        message: 'Not authorized Login again',
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({
        success: false,
        message: 'Not authorized Login again',
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: 'Failed to login',
    });
  }
};

export default adminAuth;
