exports = {};

exports.getToken = (email, user) => {
    const token = jwt.sign({identifier: user._id}, "thisisasecretKey");

    return token;
}