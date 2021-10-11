const Customer = require("../models/customer.model");
const Utility = require("../models/utilities.model")

const returnAccountWithMail = async (searchQuery) => {
    const customer = await Customer.findOne({ email: searchQuery }).sort({ _id: -1 });
    return customer;
}

exports.addBalance = async (req, res, next) => {
    // console.log(req.body)
    const { agencyAmount, primaryAmount } = req.body.amount;
    try {
        const customer = await Customer.findOne({ email: req.customerEmail });
        if (primaryAmount) {
            customer.wallets.primary_account.balance += primaryAmount;
        }
        if (agencyAmount) {
            customer.wallets.agency_account.balance += agencyAmount;
        }
        const updatedBalances = await customer.save();
        if (!updatedBalances) {
            throw new Error('Balance(s) could not be added / try again');
        }
        res.json({ message: "Balance(s) was/were added successful" })
    } catch (error) {
        next(error);
    }
}
exports.checkBalance = async (req, res, next) => {
    try {
        const customer = await Customer.findOne({ email: req.customerEmail });
        // console.log(customer.wallets.agency_account.balance);
        if (!customer) {
            throw new Error("Balance(s) not available, try again");
        }
        const totalBalance = customer.wallets.agency_account.balance +
            customer.wallets.primary_account.balance;
        res.json({
            agencyBalance: customer.wallets.agency_account.balance,
            primaryBalance: customer.wallets.primary_account.balance,
            totalBalance: totalBalance
        })
    } catch (error) {
        next(error);
    }
}
exports.sendMoneyToWallet = async (req, res, next) => {
    const { amount, accountMail } = req.body;
    let customer = {};
    try {
        customer = await returnAccountWithMail(accountMail);
        if (!customer) {
            throw new Error('Account Error/Money could not be sent')
        }
        if (amount > 500) {
            const currentCustomer = req.customer;
            console.log(currentCustomer.wallets.primary_account.balance);
            if (currentCustomer.wallets.primary_account.balance > amount) {
                currentCustomer.wallets.primary_account.balance -= amount;
                const updatedCurrentCustomer = await currentCustomer.save();
                if (!updatedCurrentCustomer) {
                    throw new Error('Could not transact from your account, try later')
                }
                customer.wallets.primary_account.balance += amount;
            } else {
                throw new Error("Make sure you have enough Balance in your account")
            }
        } else {
            throw new Error("You can transact as for > 500")
        }
        const updatedCustomer = await customer.save();
        if (!updatedCustomer) {
            throw new Error('Transaction to other account could not be performed')
        }
        res.json({ message: "Transaction to other wallet was success" })
    } catch (error) {
        next(error);
    }
}

exports.searchForParticularWallet = async (req, res, next) => {
    const searchQuery = req.params.search_query;
    try {
        // let regex = new RegExp(searchQuery, 'i');
        const accountMail = await returnAccountWithMail(searchQuery);
        if (!accountMail) {
            const error = new Error('Account with such email do not exist');
            throw error;
        }
        if(accountMail.email == req.customer.email){
            const error = new Error('Can not send money to self account');
            throw error;
        }
        res.json({ email: accountMail.email, message: "Account found, Please continue" })
    } catch (error) {
        next(error)
    }
}
exports.payBill = async (req, res, next) => {
    const utility = req.body;
    const { amount } = req.body;
    const customer = req.customer;
    // return console.log(utility);
    try {
        if (amount > req.customer.wallets.primary_account.balance || amount < 50) {
            throw new Error('The Bill could not be perfomed, not enough balance');
        }
        // if (customer.wallets.primary_account.balance > amount) {
        customer.wallets.primary_account.balance -= amount;
        const updatedCurrentCustomer = await customer.save();
        if (!updatedCurrentCustomer) {
            throw new Error('Could not pay the bill, try again')
        }
        // }
        const newUtility = new Utility({
            "customer.customerId": customer._id,
            "customer.email": customer.email,
            utility: utility
        })
        const savedUtility = await newUtility.save();
        if (!savedUtility) {
            throw new Error('The Bill could not be finalized, try again');
        }
        res.json({ message: "The Bill was successful" })
    } catch (error) {
        next(error);
    }
}

exports.getUtilities = async (req, res, next) => {
    const mail = req.customer.email;
    try {
        const utilities = await Utility.find({ "customer.email": mail }).sort({ _id: -1 })
            .limit(10);
        if (!bills) {
            throw new Error("BIlls coult not be retrieved")
        }
        res.json({ message: "Observe Your utilities summary", utilities: utilities });
    } catch (error) {
        next(error);
    }
}
