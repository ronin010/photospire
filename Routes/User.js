const express = require("express");
const Router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const RegisterMiddleware = require("../Middleware/Register");
const LoginMiddleware = require("../Middleware/Login");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require("path");
const JwtVerify = require("../Middleware/JwtVerify");

// configure multer for storing images
const multer = require("multer");


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
       
        let imagePath = "./client/public/uploads/" + req.user.user.UserName;

        if (process.env.NODE_ENV === "production") {
            imagePath = "./client/build/uploads/" + req.user.user.UserName;
        }

        if (fs.existsSync(imagePath)) {
            callback(null, imagePath)
        } else {
            fs.mkdirSync(imagePath);
            callback(null, imagePath)
        }
    },
    filename: (req, file, callback) => {
        if (req.originalUrl === "/api/users/update-profile-image") {
            callback(null, "avatar.jpg");
        } else {
            callback(null, file.originalname);
        }
    }
})

const upload = multer({storage: storage});

// @GET /api/users/
// Find And Load A User
Router.get("/", JwtVerify, (req, res) => {
    const user = req.user.user;
    
    User.findOne({_id: user._id}, (err, user) => {
        if (user) {
            user.Password = ""; 
            jwt.sign({user}, process.env.JWT_SECRET, (err, token) => {
                return res.status(200)
                .json({user, token});
            })
        } else {
            return res.sendStatus(404);
        }
    })
})

// @GET /api/users/profile/:id
// load a users profile data and do not sign a JWT
Router.get("/profile/:username", JwtVerify, (req, res) => {
    User.findOne({UserName: req.params.username}, (err, user) => {
        if (user) {
            delete user.Password;
            user.Images = user.Images.reverse();
            return res.status(200)
            .json({user});
        } else {
            return res.status(404)
            .json({"error": "User Not Found"});
        }
    })
})

// @POST /api/users/register
// Register a new user
Router.post("/register", RegisterMiddleware, (req, res) => {
    const {Email, FullName, UserName,  Password} = req.body;

    User.findOne({Email}, (err, user) => {
        if (user) {
            res.status(400).json({
                "error": "A User With That Email Already Exists"
            });
        } else {
            User.findOne({UserName}, (err, user) => {
                if (user) {
                    return res.status(400)
                    .json({
                        "error": "UserName Taken"
                    })
                } else {
                    bcrypt.hash(Password, 8, (err, hash) => {
                        const newUser = new User({
                            Email,
                            FullName,
                            UserName,
                            Password: hash,
                            AccountType: "standard"
                        })

                        newUser.save()
                        .then((user) => {
                            let imagePath = "./client/uploads/" + user.UserName;

                            if (process.env.NODE_ENV === "production") {
                                imagePath = "./client/build/uploads" + user.UserName;
                            }

                            fs.mkdirSync(imagePath, { recursive: true });
                            jwt.sign({user}, process.env.JWT_SECRET, (err, token) => {
                                delete user.Password;
                                return res.status(201)
                                .json({
                                    user, token
                                })
                            })
                        })
                    })
                }
            })
        }
    })    
});

// @POST /api/users/login
// Login a user
Router.post("/login", LoginMiddleware, (req, res) => {
    const {Email, Password} = req.body;

    User.findOne({Email}, (err, user) => {
        if (user) {
            bcrypt.compare(Password, user.Password)
            .then((success) => {
                if (success) { 
                    jwt.sign({user}, process.env.JWT_SECRET, (err, token) => {
                        return res.status(200).json({user, token})
                    })
                } else {
                    return res.status(403)
                    .json({"error": "Incorrect Password"})
                }
            })
        } else {
            return res.status(404)
            .json({"error": "User Not Found"})
        }
    })
});

// @POST /api/users/google
// Save or Load a user using provided information from a google account
Router.post("/google", (req, res) => {
    const {Email, FirstName, LastName} = req.body;

    User.findOne({Email}, (err, user) => {
        if (user) {
            jwt.sign({user}, process.env.JWT_SECRET, (err, token) => {
                return res.status(200)
                .json({user, token});
            })
        } else {
            const newUser = new User({
                Email,
                FullName: FirstName + " " + LastName,
                AccountType: "google"
            })

            newUser.save()
            .then((user) => {
                jwt.sign({user}, process.env.JWT_SECRET, (err, token) => {
                    return res.status(201)
                    .json({user, token});
                })
            })
        }
    })
})

// @POST /api/users/update-profile/:id
// Update a users profile information
Router.post("/update-profile", JwtVerify, (req, res) => {
    const {Email, FullName, UserName} = req.body;

    User.findOne({UserName: req.user.user.UserName}, (err, user) => {
        if (user) {
            user.Email = Email;
            user.FullName = FullName;
            user.UserName = UserName;
            
            user.save()
            .then((user) => {
                return res.status(200)
                .json({user})
            })
        } else {
            return res.status(404)
            .json({"error" : "User Not Found"});
        }
    })
})

// @POST /api/users/update-profile-image/
// update a users profile image 
Router.post("/update-profile-image/", JwtVerify, upload.single("profileImage"), (req, res) => {
    User.findOne({UserName: req.user.user.UserName}, (err, user) => {
        if (user) {
            user.ProfileImageUrl = req.file.originalname;
            user.save()
            .then((user) => {
                return res.status(200)
                .json({user});
            })
        } else {
            return res.status(404)
            .json({"error": "User Not Found"});
        }
    })
})

// @POST /api/users/follow/add
// @DESC - Allow a user to follow another user
Router.post("/follow/add", JwtVerify, (req, res) => {
    // username is the user being followed
    // and followerName is the user following
    const {username, followerName} = req.body;

    User.findOne({UserName: username}, (err, user) => {
        if (err) res.sendStatus(500)
        User.findOne({UserName: followerName}, (err, follower) => {
            if (err) res.sendStatus(500)

            user.Followers.push(follower.UserName);
            follower.Following.push(username);

            user.markModified("Followers");
            follower.markModified("Following");

            user.save();
            follower.save();

            res.status(200)
            .json({
               username, followerName
            })
        })
    })
})

// @POST /api/users/follow/remove
// @DESC - one users unfollows another user
Router.post("/follow/remove", JwtVerify, (req, res) => {
    // username is the user being followed
    // and followerName is the user unfollowing
    const {username, followerName} = req.body;

    User.findOne({UserName: username}, (err, user) => {
        if (err) res.sendStatus(500)
        User.findOne({UserName: followerName}, (err, follower) => {
            if (err) res.sendStatus(500)

            let followers = user.Followers;
            let following = follower.Following;

            followers.splice(followers.indexOf(username), 1);
            following.splice(following.indexOf(follower), 1);

            user.markModified("Followers");
            follower.markModified("Following");

            user.save();
            follower.save();

            res.status(200)
            .json({
               username, followerName
            })
        })
    })
})

module.exports = Router;
