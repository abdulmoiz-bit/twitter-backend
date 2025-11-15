const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  createSendToken(newUser, 201, res);
  /*
    res.status(201).json({
        status: "success",
        data: {
            user: newUser
        }
    })
    */
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  //if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// LOGIN

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    throw new Error("please provide email and passowrd");
  }

  // 2) Check if user exists && password is correct
  // +passoword can not understand
  const user = await User.findOne({ email }).select("+password");

  // solve this immediately
  /*
  if (!user || !(await user.correctpassword(password, user.password))) {
    throw new Error("incorrect email or password");
  }
*/
  createSendToken(user, 200, res);
};

exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new Error("you are not logged in"));
  }

  // 2) Verification token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new Error("the user is not exist"));
  }

  // GRANT ACCESS
  req.user = currentUser;
  next();
};

/*
exports.restrictTo = (...roles) => {
  
}
*/