const { default: axios } = require("axios");
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require('cookie-parser');

//template engine
app.set("view engine", "ejs");

app.use("/libs",express.static(path.join(__dirname, "/node_modules")));
app.use("/static",express.static(path.join(__dirname, "/public")));
app.use(cookieParser());

app.get("/blogs/:blogId", async(req, res) => {
    const blogId = req.params.blogId;
    try{
        const response = await axios.get("http://localhost:3000/api/user/blogs/"+blogId);
        const blog = response.data.blog;
        console.log(response.data.customVar);
        return res.render("user/blog-details", {
            title: response.data.title,
            blog: blog
        });
    }
    catch(err){
        console.log(err); // .toJSON()
        // console.log(err.response);
        if (err.response) {
            if (err.response.status == 404) {
                // res.status(404);
                // return res.render("error/404", {
                //     title: "Not Found",
                //     statusCode: err.response.status
                // });
                return res.status(err.response.status).redirect("/error/404");
            }
        }
    };
    res.end();
});

app.get("/admin/post", async(req, res) => {
    const gidenData = {
        name: "burak"
    };

    const headers = {
        'Content-Type': 'application/json',
        'x-auth-token': req.cookies['x-auth-token'], //req.headers['x-auth-token'], //req.cookies['x-auth-token']
        'custom-header': 'samet'
    };
    console.log(headers);
    try{
        const response = await axios.post('http://localhost:3000/api/admin/postProduct', gidenData,{ headers }
        );

        res.render("admin/post", {
            title: response.data.title,
            data: response.data.data,
        });
    }
    catch(err){
        console.log(err.response.data);
        res.end();
    }
});

app.get("/admin", async(req, res) => {
    try{
        const response = await axios.get("http://localhost:3000/api/admin/");
        const data = response.data.data;
        const token = response.headers["x-auth-token"];

        res.cookie('x-auth-token', token, {
            httpOnly: true,
            secure: true
        });

        console.log(token);
        // res.header('x-auth-token', token).redirect("/admin/post");
        
        res.render("admin/index", {
            title: response.data.title,
            data: data
        });
    }
    catch(err){
        console.log(err);
    };
});

app.get("/", async(req, res) => {
    try{
        const response = await axios.get("http://localhost:3000/api/user/");
        console.log(response.data.title);
        const blogs = response.data.blogs;
        // res.send({ blogs });
        res.render("user/index", {
            title: response.data.title,
            blogs: blogs
        });
    }
    catch(err){
        console.log(err);
    };
});

app.get("/error/404", (req, res) => {
    statusCode = req
    console.log(statusCode);
    res.render("error/404", {
        title: "Not Found",
        statusCode: statusCode
    });
});

app.listen(3500, () => {
    console.log("Listening port on 3500");
})