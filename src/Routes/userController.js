const doctorModel = require('../Models/Doctor.js');
const adminModel = require('../Models/Admin.js');
const patientModel = require('../Models/Patient.js');
const bcrypt = require('bcrypt');

require('dotenv').config();
const jwt = require('jsonwebtoken');
const maxAge = parseInt(process.env.MAXAGE);

const createToken = async (name) => {
    try {
        const saltRounds = parseInt(process.env.BCRYPT_TOKEN) ;
        const secretKey = await bcrypt.genSalt(saltRounds);
        
        return jwt.sign({ name }, secretKey, {
            expiresIn: maxAge

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
                    res.cookie(user.username + 'token', token, { httpOnly: true, maxAge: maxAge });
                    return res.status(200).json({ success: true, user: user, message: "Admin login successful" });
                } else if (user instanceof patientModel) {
                    res.cookie(user.username + 'token', token, { httpOnly: true, maxAge: maxAge });
                    return res.status(200).json({ success: true, user: user, message: "Patient login successful" });
                } else if (user instanceof doctorModel) {
                    res.cookie(user.username + 'token', token, { httpOnly: true, maxAge: maxAge});
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
    res.clearCookie(req.username+'token');
    res.status(200).json({ success: true, message: "Logout successful" });
};


module.exports = {
    login,
    logout
  };