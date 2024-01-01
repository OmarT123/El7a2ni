const doctorModel = require('../Models/Doctor.js');
const adminModel = require('../Models/Admin.js');
const userModel = require('../Models/User.js');
const patientModel = require('../Models/Patient.js');
const pharmacistModel = require('../Models/Pharmacist.js');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const jwt = require('jsonwebtoken');


const maxAge = parseInt(process.env.MAXAGE);


const createToken = (name) => {
    try {
        const secretKey = process.env.JWT_SECRET;
        return jwt.sign({ name }, secretKey, {
            expiresIn: maxAge,
        });
    } catch (error) {
        console.error("Error creating token:", error);
        throw error;
    }
};



const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username) {
            return res.json({ success: false, message: "Username is required. Please enter a valid username!" });
        }

        if (!password) {
            return res.json({ success: false, message: "Password is required. Please enter a valid password!" });
        }

        let user = await adminModel.findOne({ username: username });

        if (!user) {
            user = await patientModel.findOne({ username: username });
        }

        if (!user) {
            user = await doctorModel.findOne({ username: username });
        }
        if(!user) {
            user= await pharmacistModel.findOne({username:username});
        }
        if (user) {
            const passwordMatched = await bcrypt.compare(password, user.password);
            if (passwordMatched) {
                const token = createToken(user.username);
                if (user instanceof adminModel) {
                    res.cookie('userToken', token, { httpOnly: true, maxAge: null });
                    return res.json({ success: true, user: user, message: "Admin login successful" });
                } else if (user instanceof patientModel) {
                    res.cookie( 'userToken', token, { httpOnly: true, maxAge: null });

                    return res.json({ success: true, user: user, message: "Patient login successful" });
                } else if (user instanceof doctorModel) {
                    res.cookie('userToken', token, { httpOnly: true, maxAge: null});

                    return res.json({ success: true, user: user, message: "Doctor login successful" });
                }
                else if (user instanceof pharmacistModel){
                    res.cookie('userToken', token, { httpOnly: true, maxAge: null});

                    return res.json({ success: true, user: user, message: "Pharmacist login successful" });
                }
            } else {
                return res.json({ success: false, message: "Invalid Password" });
            }
        } else {
            return res.json({ success: false, message: "User not found!" });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.json({ success: false, error: "Internal server error" });
    }
};


const logout = (req, res) => {
    res.clearCookie('userToken');
    res.json({ success: true, message: "Logout successful" });
};

const loginAuthentication = async (req, res) => {
    const token = req.headers.cookie?.split('; ').find(row => row.startsWith('userToken'))?.split('=')[1];
        if (!token) {
        return res.json({ success: false, message: "User not authenticated" });
    }

    try {
        const secretKey = process.env.JWT_SECRET;
        const decodedToken = jwt.verify(token, secretKey);
        req.username = decodedToken.name; 
        let user = await userModel.findOne({username : decodedToken.name});
        let client = await adminModel.findOne({ username: decodedToken.name });
        if(client){
            await userModel.findOneAndUpdate(
                { username: decodedToken.name },
                { $set: { type: 'admin' } }, 
                { new: true } 
              );
              return res.json({ success: true, type: 'admin', user: client, message: "User is authenticated" });
              
        
        }
        else if (!client) {
            client = await patientModel.findOne({ username: decodedToken.name });
            if(client){
                await userModel.findOneAndUpdate(
                    { username: decodedToken.name },
                    { $set: { type: 'patient' } },
                    { new: true } 
                  );
                  return res.json({ success: true, type: 'patient', user: client, message: "User is authenticated" });
            }
            else if(!client){
                client = await doctorModel.findOne({ username: decodedToken.name });
                if(client){
                    await userModel.findOneAndUpdate(
                        { username: decodedToken.name },
                        { $set: { type: 'doctor' } }, 
                        { new: true } 
                      );
                      return res.json({ success: true, type: 'doctor', user: client, message: "User is authenticated" });

                }
                else if (!client){
                    client = await pharmacistModel.findOne({ username: decodedToken.name });
                    if(client){
                        await userModel.findOneAndUpdate(
                            { username: decodedToken.name },
                            { $set: { type: 'pharmacist' } }, 
                            { new: true } 
                          );
                          return res.json({ success: true, type: 'pharmacist', user: client, message: "User is authenticated" });
    
                    }
                    else{
                        return res.json({ success: false, message: "User not authenticated" });
                    }
                    
                }
             

            }
        }
        
    } catch (error) {
        console.error("Token verification error:", error);
        return res.json({ success: false, message: "Invalid token" });
    }
};

const getUserFromTokenMiddleware = async (req, res, next) => {
    const token = req.headers.cookie?.split('; ').find(row => row.startsWith('userToken'))?.split('=')[1];
        if (!token) {
        return res.json({ success: false, message: "User not authenticated" });
    }

    try {
        const secretKey = process.env.JWT_SECRET;
        const decodedToken = jwt.verify(token, secretKey);
        req.username = decodedToken.name; 
        let user = await userModel.findOne({username : decodedToken.name});
        let client = await adminModel.findOne({ username: decodedToken.name });
        if(client){
            await userModel.findOneAndUpdate(
                { username: decodedToken.name },
                { $set: { type: 'admin' } }, 
                { new: true } 
              ); 
        }
        else if (!client) {
            client = await patientModel.findOne({ username: decodedToken.name });
            if(client){
                await userModel.findOneAndUpdate(
                    { username: decodedToken.name },
                    { $set: { type: 'patient' } },
                    { new: true } 
                  );
                }
            else if(!client){
                client = await doctorModel.findOne({ username: decodedToken.name });
                if(client){
                    await userModel.findOneAndUpdate(
                        { username: decodedToken.name },
                        { $set: { type: 'doctor' } }, 
                        { new: true } 
                      );


                }
                else if (!client){
                    client = await pharmacistModel.findOne({ username: decodedToken.name });
                    if(client){
                        await userModel.findOneAndUpdate(
                            { username: decodedToken.name },
                            { $set: { type: 'pharmacist' } }, 
                            { new: true } 
                          );
    
    
                    }
                    else{
                        return res.json({ success: false, message: "User not authenticated" });
                    }

                }
               

            }
        }
        
        req.user = client ;
        next(); 
    } catch (error) {
        console.error("Token verification error:", error);
        return res.json({ success: false, message: "Invalid token" });
    }
};


const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = req.user ;

    try {
        
        let typeOfUser = await userModel.findOne({username:user.username});

        const passwordMatched = await bcrypt.compare(oldPassword, user.password);

        if (!passwordMatched) {
            return res.json({ success: false, message: "Invalid old password!" });
        }
        if(oldPassword===newPassword){
            return res.json({ success: false, message: "You can't use the same password !" });

        }

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%^&*()?[\]{}|<>])[A-Za-z\d@$!%^&*()?[\]{}|<>]{10,}$/;

        if (!passwordRegex.test(newPassword)) {
            return res.json({
                success: false,
                message: "New password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character, and be at least 10 characters long.",
            });
        }

        const salt = await bcrypt.genSalt();
        const encryptedPassword = await bcrypt.hash(newPassword, salt);

        if (user instanceof adminModel) {
            await adminModel.findByIdAndUpdate(user._id, { password: encryptedPassword });
        } else if (user instanceof patientModel) {
            await patientModel.findByIdAndUpdate(user._id, { password: encryptedPassword });
        } else if (user instanceof doctorModel) {
            await doctorModel.findByIdAndUpdate(user._id, { password: encryptedPassword });
        }
        else if (user instanceof pharmacistModel) {
            await pharmacistModel.findByIdAndUpdate(user._id, { password: encryptedPassword });
        }


        return res.json({ success: true, message: "Password changed successfully" });
    }  catch (error) {
        console.error("Change password error:", error);
        return res.json({ success: false, error: "Internal server error" });
    }
};



const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.NODEMAILER_EMAIL, 
    pass: process.env.NODEMAILER_PASSWORD, 
  },
});

const sendOTPByEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

const saveOTPCookie = (res, otp) => {
  res.cookie('passwordResetOTP', otp, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
  });
};

const resetPassword = async (req, res) => {

  const   {username }= req.body;

  try {
    let userData = null ;
    const user = await userModel.findOne({ username: username });

    if (!user) {
        return res.json({ success: false, message: 'User not found ' });
      }
    else if(user.type==='admin'){
         userData = await adminModel.findOne({username : username});
    }
    else if (user.type==='patient'){

        userData = await patientModel.findOne({username : username});
    }
    else if (user.type==='doctor'){
        userData = await doctorModel.findOne({username : username});
    }
    else if (user.type === 'pharmacist'){
        userData = await pharmacistModel.findOne({username : username});

    }
    if(userData){
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    saveOTPCookie(res, otp);
    await sendOTPByEmail(userData.email, otp);

    return res.json({ success: true, message: 'OTP sent successfully. Check your email.' });
    }
    else {
        return res.json({ success: false, message: 'User data not found or user type not recognized' });
 
    }
  } catch (error) {
    console.error('Password reset error:', error);
    return res.json({ success: false, error: 'Internal server error' });
  }
};

const resetPasswordWithOTP = async (req, res) => {
  const { username, otp ,newPassword } = req.body;

  try {
    const user = await userModel.findOne({ username :username });

    if (!user) {
        return res.json({ success: false, message: 'User not found ' });
      }
      else if(user.type==="admin"){
        userData = await adminModel.findOne({username : username});
   }
   else if (user.type==="patient"){
       userData = await patientModel.findOne({username : username});
   }
   else if (user.type==="doctorModel"){
       userData = await doctorModel.findOne({username : username});
   }
   else if (user.type ==="pharmacist"){
    userData = await pharmacistModel.findOne({username : username});

   }

    const storedOTP = req.cookies.passwordResetOTP;

    if (!storedOTP) {
      return res.json({ success: false, message: 'OTP not found. Initiate the password reset process again.' });
    }

    res.clearCookie('passwordResetOTP');

    if (storedOTP !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    const passwordMatchedOld = await bcrypt.compare(newPassword,userData.password);
    if(passwordMatchedOld){
        return res.json({success:false , message : 'New Password can not be as same as Old Password '});
    }

    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(newPassword, salt);

    if (userData instanceof adminModel) {
        await adminModel.findByIdAndUpdate(userData._id, { password: encryptedPassword });
    } else if (userData instanceof patientModel) {
        await patientModel.findByIdAndUpdate(userData._id, { password: encryptedPassword });
    } else if (userData instanceof doctorModel) {
        await doctorModel.findByIdAndUpdate(userData._id, { password: encryptedPassword });
    }
    else if (userData instanceof pharmacistModel) {
        await pharmacistModel.findByIdAndUpdate(userData._id, { password: encryptedPassword });
    }

    await userData.save();

    return res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset with OTP error:', error);
    return res.json({ success: false, error: 'Internal server error' });
  }
};


  

module.exports = {
    login,
    logout,
    getUserFromTokenMiddleware,
    changePassword,
    resetPassword,
    resetPasswordWithOTP,loginAuthentication

  };

