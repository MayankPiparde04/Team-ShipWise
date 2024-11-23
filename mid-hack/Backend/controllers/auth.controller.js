const User = require("../models/auth.model");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");

const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandling");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.MAIL_KEY);
const nodemailer = require("nodemailer");

exports.registerController = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate incoming data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ errors: firstError });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).json({ errors: "Email is already taken." });
    }

    // Generate a JWT token for account activation
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: '30m' }
    );

    // Create a transporter object using Gmail service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password
      },
    });

    // Email data to send the activation link
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Account Activation Link',
      html: `
        <h1>Please use the following link to activate your account</h1>
        <p><a href="${process.env.CLIENT_URL}/auth/activate/${token}">Activate Account</a></p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>${process.env.CLIENT_URL}</p>
      `,
    };

    // Send the email with the defined transport object
    await transporter.sendMail(emailData);

    return res.json({
      message: `Email has been sent to ${email}. Please follow the link to activate your account.`,
    });

  } catch (err) {
    console.error("Error during registration:", err);
    return res.status(500).json({
      errors: "Internal server error. Please try again.",
    });
  }
};

exports.activationController = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ errors: "No token provided." });
  }

  jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async (err, decoded) => {
    if (err) {
      console.log("Token verification error:", err.message);
      return res.status(401).json({ errors: "Invalid or expired activation link." });
    }

    const { name, email, password } = decoded;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email }).exec();
      if (existingUser) {
        return res.status(400).json({ errors: "User already exists or account is already activated." });
      }

      // Create new user
      const newUser = new User({ name, email, password });

      await newUser.save();  // Save the user
      return res.status(201).json({ success: true, message: "Account activated successfully!" });

    } catch (saveErr) {
      console.log("Save error:", errorHandler(saveErr));
      return res.status(500).json({ errors: "Error saving user." });
    }
  });
};


exports.signinController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    // check if user exist
    User.findOne({
      email,
    }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          errors: "User with that email does not exist. Please signup",
        });
      }
      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          errors: "Email and password do not match",
        });
      }
      // generate a token and send to client
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      const { _id, name, email, role } = user;

      return res.json({
        token,
        user: {
          _id,
          name,
          email,
          role,
        },
      });
    });
  }
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET, // req.user._id
});

exports.adminMiddleware = (req, res, next) => {
  User.findById({
    _id: req.user._id,
  }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        error: "Admin resource. Access denied.",
      });
    }

    req.profile = user;
    next();
  });
};

exports.forgotPasswordController = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    User.findOne(
      {
        email,
      },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "User with that email does not exist",
          });
        }

        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.JWT_RESET_PASSWORD,
          {
            expiresIn: "10m",
          }
        );

        const emailData = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `Password Reset link`,
          html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `,
        };

        return user.updateOne(
          {
            resetPasswordLink: token,
          },
          (err, success) => {
            if (err) {
              console.log("RESET PASSWORD LINK ERROR", err);
              return res.status(400).json({
                error:
                  "Database connection error on user password forgot request",
              });
            } else {
              sgMail
                .send(emailData)
                .then((sent) => {
                  // console.log('SIGNUP EMAIL SENT', sent)
                  return res.json({
                    message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
                  });
                })
                .catch((err) => {
                  // console.log('SIGNUP EMAIL SENT ERROR', err)
                  return res.json({
                    message: err.message,
                  });
                });
            }
          }
        );
      }
    );
  }
};

exports.resetPasswordController = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    if (resetPasswordLink) {
      jwt.verify(
        resetPasswordLink,
        process.env.JWT_RESET_PASSWORD,
        function (err, decoded) {
          if (err) {
            return res.status(400).json({
              error: "Expired link. Try again",
            });
          }

          User.findOne(
            {
              resetPasswordLink,
            },
            (err, user) => {
              if (err || !user) {
                return res.status(400).json({
                  error: "Something went wrong. Try later",
                });
              }

              const updatedFields = {
                password: newPassword,
                resetPasswordLink: "",
              };

              user = _.extend(user, updatedFields);

              user.save((err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: "Error resetting user password",
                  });
                }
                res.json({
                  message: `Great! Now you can login with your new password`,
                });
              });
            }
          );
        }
      );
    }
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
// Google Login
exports.googleController = (req, res) => {
  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
    .then((response) => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
};

exports.facebookController = (req, res) => {
  console.log("FACEBOOK LOGIN REQ BODY", req.body);
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return (
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      // .then(response => console.log(response))
      .then((response) => {
        const { email, name } = response;
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR FACEBOOK LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with facebook",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      })
      .catch((error) => {
        res.json({
          error: "Facebook login failed. Try later",
        });
      })
  );
};
