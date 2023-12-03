const doctorModel = require('../Models/Doctor.js');
const adminModel = require('../Models/Admin.js');
const patientModel = require('../Models/Patient.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require('fs');



require('dotenv').config();
const jwt = require('jsonwebtoken');
const maxAge = parseInt(process.env.MAXAGE);
const secretKey = crypto.randomBytes(32).toString('hex');

fs.writeFileSync('.env', `JWT_SECRET=${secretKey}\n`);

console.log('Secret key generated and saved to .env file.');


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

console.log(maxAge);
console.log(maxAge);

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username) {
            return res.status(400).json({ success: false, message: "Username is required. Please enter a valid username!" });
        }

        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required. Please enter a valid password!" });
        }

        let user = await adminModel.findOne({ username: username });

        if (!user) {
            user = await patientModel.findOne({ username: username });
        }

        if (!user) {
            user = await doctorModel.findOne({ username: username });
        }
        if (user) {
            const passwordMatched = await bcrypt.compare(password, user.password);
            if (passwordMatched) {
                const token = createToken(user.username);
                if (user instanceof adminModel) {
                    res.cookie('userToken', token, { httpOnly: true, maxAge: maxAge });
                    return res.status(200).json({ success: true, user: user, message: "Admin login successful" });
                } else if (user instanceof patientModel) {
                    res.cookie( 'userToken', token, { httpOnly: true, maxAge: maxAge });
                    return res.status(200).json({ success: true, user: user, message: "Patient login successful" });
                } else if (user instanceof doctorModel) {
                    res.cookie( 'userToken', token, { httpOnly: true, maxAge: maxAge});
                    return res.status(200).json({ success: true, user: user, message: "Doctor login successful" });
                }
            } else {
                return res.status(401).json({ success: false, message: "Invalid Password" });
            }
        } else {
            return res.status(404).json({ success: false, message: "User not found!" });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};


const logout = (req, res) => {
    res.clearCookie('userToken');
    res.status(200).json({ success: true, message: "Logout successful" });
};

const getUserFromTokenMiddleware = async (req, res, next) => {
    const token = req.headers.cookie.split('; ').find(row => row.startsWith('userToken')).split('=')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    try {
        const secretKey = process.env.JWT_SECRET;
        const decodedToken = jwt.verify(token, secretKey);
        req.username = decodedToken.name; 
        next(); 
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};


const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const username = req.username; 

    try {
        
        let user = await adminModel.findOne({ username: username });

        if (!user) {
            user = await patientModel.findOne({ username: username });
        }

        if (!user) {
            user = await doctorModel.findOne({ username: username });
        }
        if (!user) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const passwordMatched = await bcrypt.compare(oldPassword, user.password);

        if (!passwordMatched) {
            return res.status(401).json({ success: false, message: "Invalid old password" });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
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

        return res.status(200).json({ success: true, message: "Password changed successfully" });
    }  catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

module.exports = {
    login,
    logout,
    getUserFromTokenMiddleware,
    changePassword

  };