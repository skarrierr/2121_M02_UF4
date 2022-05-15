#!/usr/bin/node

let http = require("http");
let fs = require("fs");
let mongo_client = require("mongodb").MongoClient;
let url = "mongodb://localhost/";
let ObjectId = require("mongodb").ObjectID;
let db;

console.log("Iniciando script mongo-http");

mongo_client.connect(url, function(error, conn){
	console.log("Dentro de MongoDB");
	
	if (error) {
		console.log("ERROR!");
		return;
		}

	db = conn.db("tffhd");

});


function send_data_list (db, req, res){
	let col = "";
	let col_data = "";
	if (req.url == "/characters"){
		col = "characters";
		col_data = db.collection(col).find({}, { projection: { name:1 } });
	}

	
	else if(req.url == "/Items"){
		col = "Items";
		 col_data = db.collection(col).find({}, { projection: { item:1 } });
	}
	else if (req.url == "/weapons"){
		col = "weapons";
		 col_data = db.collection(col).find({}, { projection: { weapon:1 } });
	}
	else{
		res.end();
		return;
	}


	
	col_data.toArray(function(err, data){
		let string = JSON.stringify(data);
		res.end(string);
	});
}

http.createServer(function(req, res){
	res.writeHead(200);
	
	if (req.url == "/") {
		fs.readFile("index.html", function (err, data){
				res.writeHead(200, {"Content-Type": "text/html"});
				res.end(data);
				});
		
		return;
		}
	let url = req.url.split("/");

	if (url.length==2){
		send_data_list(db, req, res);
		return;
	}	

	if (url[2].length != 24){

		res.end();
		return;
	}
	if(url[1]=="characters"){
		let obj_id = new ObjectId(url[2]);
		let col_data = db.collection("characters").find({"_id":obj_id}, {projection:{"name":1 }});
			col_data.toArray(function(err, data){
				let string = JSON.stringify(data);
				res.end(string);
			});
		}
	else if (url[1] == "Items") {
		   let obj_id = new ObjectId(url[2]);
		  
		   let col_data = db.collection("Items").find({"_id":obj_id}, {projection:{"item":1}});
			col_data.toArray(function(err, data){
			 let string = JSON.stringify(data);
			  res.end(string);
			   });
	}
	else if (url[1] == "weapons") {
		 let obj_id = new ObjectId(url[2]);
		  let col_data = db.collection("weapons").find({"_id":obj_id}, {projection:{"weapon":1}});
		  col_data.toArray(function(err, data){
		  let string = JSON.stringify(data);
		  res.end(string);
		  });
	}
	else if (url[1] == "remove") {
	  let obj_id = new ObjectId(url[2]);
	  collectionName = url[3];
	  db.collection(collectionName).deleteOne({"_id":obj_id});
	  res.end("Deleted");
	   
	} 






}).listen(1095);




