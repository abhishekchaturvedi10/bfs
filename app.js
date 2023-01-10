var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var mongodb = require('mongodb');
const bodyParser = require('body-parser');
var app = express();
var mongoose = require("mongoose");
var port = 3000;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/bfs", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded');
    } else {
        console.log('Error in DB connection : ' + err);
    }
});

var binarytreenode = new mongoose.Schema ({
    value: Number, 
    left: Number,
    right: Number
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send("Welcome to bfs app");
});

app.get('/bfs?startNodeId=startNodeId', async (req, res) => {

    const startNodeId = req.param.startNodeId;
  
    const queue = [parseInt(startNodeId,10)];
    const visited = [];
  
    while (queue.length > 0) {

        const currentNodeId = queue.shift();

        console.log("currentNodeId = " + currentNodeId);

        visited.push(currentNodeId);

        var curnodeid = parseInt(currentNodeId,10);
    
        var binarytreenodes = mongoose.model("binarytreenodes", binarytreenode);

        await binarytreenodes.findOne({value: curnodeid}).then((post) => {
		    console.log("post = ", post);
            if (post && post.left!==-1 && !visited.includes(post.left)) {
                queue.push(post.left);
                console.log("post.left = ", post.left);
            }
            if (post && post.right!==-1 && !visited.includes(post.right)) {
                queue.push(post.right);
                console.log("post.right = ", post.right);
            }
	    });

        console.log("visited = " + visited);
        console.log("queue = " + queue);
    }
  
    res.send(visited);
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});