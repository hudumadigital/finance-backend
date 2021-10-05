const Customer = require('../models/customer.model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validatorHelper = (password, hashedPassword, callback) => {
    bcrypt
        .compare(password, hashedPassword)
        .then((doMatch) => {
            if (doMatch) {
                return callback(doMatch);
            }
            return callback(doMatch);
        })
        .catch((error) => {
            // console.log(error);
            return callback(false);
        });
};

exports.postRegisterCustomer = async (req, res, next) => {
    const { username, mobile, email, password } = req.body;
  
    try {
        const customer = await Customer.findOne({ email: email });
        console.log(customer);
        if (customer) {
            console.log('here');
           throw new Error('Customer already exist');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        if (!hashedPassword) {
            throw new Error('Customer already exist');
        }
        const newCustomer = new Customer({
            email: email,
            username: username,
            password: hashedPassword,
            mobile: mobile,
        });
        const savedCustomer = await newCustomer.save();
        if (!savedCustomer) {
            const error = new Error(
                "ERROR OCCURED | COULD NOT BE REGISTERED"
            );
            error.statusCode = 500;
            throw error;
        }
        res
            .status(200)
            .json({ message: "CUSTOMER REGISTERED", success: true });
    } catch (error) {
        next(error);
    }
}
exports.postLogin = async (req, res, next) => {
    const { password, email } = req.body;
    try {
        const customer = await Customer.findOne({ email: email });
        if (!customer) {
            const error = new Error(
                "Customer with " + email + " do not exist, consider register"
            );
            error.statusCode = 401;
            throw error;
        }
        validatorHelper(password, customer.password, (doMatch) => {
            if (!doMatch) {
                const err = new Error(
                    "Email or Password incorrect"
                );
                err.statusCode = 401;
                // throw err;
                return res.json({ message: 'Email or password incorrect', isSuccess: false })
            }
            const token = jwt.sign(
                {
                    email: email,
                    customerId: customer._id,
                },
                "secureFinance",
                {
                    expiresIn: "1hr"
                }
            );
            res.status(201).json({
                success: true,
                token: token,
                email: email,
                customerId: customer._id.toString(),
                isLoggedIn: true,
                expiresIn: 3600,
                username: customer.username,
            });
        })
    } catch (error) {
        next(error);
    }
}