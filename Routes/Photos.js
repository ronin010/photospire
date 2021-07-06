const express = require("express");
const Router = express.Router();
const multer = require("multer");
const User = require("../Models/User");
const Image = require("../Models/Image");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const JwtVerify = require("../Middleware/JwtVerify");
const path = require("path");
const comment = require("../Models/Comment")

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const storage = multer.diskStorage({
    destination: (req, file, callback) => { 
        let imagePath  = "./client/public/uploads/" + req.user.user.UserName;
        
        // if the environment is for production, then the image storage path will be in the build directory
        // for development, it will be in the client public directory
        if (process.env.NODE_ENV === "production") {
            imagePath = "./client/build/uploads/" + req.user.user.UserName;
        }

        if (fs.existsSync(imagePath)) {
            callback(null, imagePath)
        } else {
            fs.mkdirSync(imagePath);
            callback(null, imagePath);
        }
    },
    filename: (req, file, callback) => {
        callback(null, uuidv4() + path.extname(file.originalname));
    }
})

const upload = multer({storage: storage});

// @POST /api/posts/add
// @DESC - add a new image
Router.post("/add", JwtVerify, upload.single("file"), (req, res) => {
    const {title, tags} = req.body;
   
    const image = req.file;

    User.findOne({UserName: req.user.user.UserName}, (err, user) => {
        if (user) {
            const userImages = user.Images;

            let currentDate = new Date();
            let cDay = currentDate.getDate();
            let cMonth = currentDate.getMonth();
            let cYear = currentDate.getFullYear();

            const month = (monthNames[cMonth]);
            const fullDate = cDay + " "  + month + " " + cYear;

            let tagsArr = tags.split(",");
            

            const newImage = new Image(image.filename, title, [], [] , fullDate , tagsArr , req.user.user.UserName);
            userImages.push(newImage);
            user.save()
            .then(() => res.status(200).json({image: newImage}));
        } else {
            res.status(404).json({message: "User Not Found"})
        }
    })

})

// @GET /api/photos/:username/:filename
// @DESC - load the data for a particular image (likes, comments, name, etc...)
Router.get("/:username/:filename", JwtVerify, (req, res) => {
    const {username, filename} = req.params;

    User.findOne({UserName: username}, (err, user) => {
        if (user) {
            const image = user.Images.find(image => image.FileName === filename)
            
            image.Comments = image.Comments.reverse();

            if (image) {
                res.json({image});
            } else {
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(404)
        }
    })
})

// @DELETE /api/photos/:filename
// @DESC - delete an image based on the file name and remove it from the local directory
Router.delete("/:filename", JwtVerify, (req, res) => {
    const {filename} = req.params;

    // delete image from directory
    let imagePath  = "./client/public/uploads/" + req.user.user.UserName;

    if (process.env.NODE_ENV === "production") {
        imagePath = "./client/build/uploads/" + req.user.user.UserName;
    }

    User.findOneAndUpdate({UserName: req.user.user.UserName}, {
        $pull : {Images: {FileName: filename}}
    }, { multi: true }, (err) => {
        fs.unlinkSync(imagePath + `/${filename}`, (err) => {
            if (err) {
                res.status(500).json({
                    message: "Internal Server Error"
                })
            } else {
                res.status(200).json({message: "success"});
            }
        })
        
    })
})

// @POST /api/photos/:filename/like
// @DESC - Add a like to an image by adding the users name to the likes array
Router.post("/:filename/like", JwtVerify, (req, res) => {
    const {filename} = req.params;
    const {username} = req.body;
    
    User.findOne({"Images.FileName": filename}, (err, doc) => {
        if (err) {
            res.sendStatus(500);
        } else {
            // access Likes array from the found document
            const likes = doc.Images.find(img => img.FileName === filename).Likes
            // if the likes array does not contain the username, then add it (add like)
            if (!likes.includes(username)) {
                likes.push(username);
                doc.Images.find(img => img.FileName === filename).Likes = likes;
                doc.markModified("Images");
                doc.save()
                res.json({message: "Successfully added like"})
            } else {
                // else remove the users name from the likes array (unline)
                const index = likes.indexOf(username);
                likes.splice(index, 1);
                doc.Images.find(img => img.FileName === filename).Likes = likes;
                doc.markModified("Images");
                doc.save()
                res.json({message: "Successfully removed like"});
            }
        }
    })
})  

// @POST /api/photos/:filename/comments/add
// @DESC - Add a new comment to an image
Router.post("/:filename/comments/add", JwtVerify, (req, res) => {
    const {filename} = req.params;

    User.findOne({"Images.FileName": filename}, (err, user) => {
        if (user) {
            let currentDate = new Date();
            let cDay = currentDate.getDate();
            let cMonth = currentDate.getMonth();
            let cYear = currentDate.getFullYear();

            const month = (monthNames[cMonth]);
            const fullDate = cDay + " "  + month + " " + cYear;

            const newComment = new comment(req.user.user.UserName, req.body.comment, fullDate)

            const comments = user.Images.find(img => img.FileName === filename).Comments;
            comments.push(newComment);
            user.Images.find(img => img.FileName === filename).Comments = comments;
            user.markModified("Images");
            user.save();
            res.json({"comment": newComment})
        } else {
            res.sendStatus(404);
        }
    })
})

// @POST /api/photos/tags/:tag
// @DESC - find all images with a specific tag
Router.post("/tags", JwtVerify, (req, res) => {
    const {tag} = req.body;
    let images = []

    console.log(tag)
    
    // find all users where the user's images contains tags matching the searched for tag
    User.find({"Images": {
        $elemMatch: {
            "Tags": {
                $elemMatch:{
                    $in:[tag]
                }
            }
        }
    }},(err, users) => {
        if (err)  {
            res.sendStatus(500)
        } else {
            // loop through users and pull out the images where the tags match the searched for tag
            users.map((user) => {
                images.push.apply(images, user.Images.filter(img => img.Tags.includes(tag)))
            })

            res.json({"images": images.reverse()})
        }
    })
})

// @POST /api/photos/
// @DESC - search using a query under different fields 
// @BUGS - for some reason using method: GET returns 404 every time
Router.post("/discover/:value", JwtVerify, (req, res) => {
    const {value} = req.params;
    let userData = [];
    let images = [];
   
    // search for users (where the username contains the search query)
    User.find({UserName: {$regex: `.*${value}.*`}}, (err, users) => {
        if (err) res.sendStatus(500);

        User.find({"Images": {
            $elemMatch: {
                "Tags": {
                    $elemMatch:{
                        $in:[value]
                    }
                }
            }
        }},(err, results) => {
            results.map((user) => {
                images.push.apply(images, user.Images);
            })
            
            res.json({images, users})
        })
        
    })
})

module.exports = Router;
