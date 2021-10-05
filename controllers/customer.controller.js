const Customer = require("../models/customer.model");

exports.addBalance = async (req, res, next) => {
    const { agencyBalance, primaryBalance } = req.body;
    try {
        const customer = await Customer.findOne({ email: req.customerEmail });
        if (primaryBalance) {
            customer.wallets.primaryAccount.balance += primaryBalance;
        }
        if (agencyBalance) {
            customer.wallets.agencyAccount.balance += agencyBalance;
        }
        const updatedBalances = await customer.save();
        if (!updatedBalances) {
            throw new Error('Balance(s) could not be added / try again');
        }
        res.json({ message: "Balance(s) was/were added succeful" })
    } catch (error) {
        next(error);
    }
}
exports.checkBalance = async (req, res, next) => {
    try {
        const customer = await Customer.findOne({ email: customerEmail });
        if (!customer) {
            throw new Error("Balance(s) not available, try again");
        }
        const totalBalance = customer.wallets.agancyAccount.balance +
            customer.wallets.primaryAccount.balance;
        res.json({
            agencyBalance: customer.wallets.agancyAccount.balance,
            primaryBalance: customer.wallets.primaryAccount.balance,
            totalBalance: totalBalance
        })
    } catch (error) {
        next(error);
    }
}