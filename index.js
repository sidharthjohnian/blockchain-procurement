let express = require('express');
let conv = require('binstring');
let http = require('http'); 
let request = require("request");
let multichain = require('multichain-node')({
	port: 6834,
	host: 'localhost',
	user: 'multichainrpc',
	pass: 'EbMS9GTgHVkW2ubDyQQTYjZoqdoMCPZ43W9ugRzfAbWj',
});


let Promise = require('promise');

let app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

let port = process.env.PORT || 3000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return next();
});

app.get('/getInfo', function(req, res) {
	multichain.getInfo(function(err, info) {
		if(err){
			res.json(err);
		}
		else {
			res.json(info);
		}
	});
});

app.get('/getBlockchainInfo', function(req, res) {
	multichain.getBlockchainInfo(function(err, info) {
		if(err){
			res.json(err);
		}
		else {
			res.json(info);
		}
	});
});

app.get('/getNetworkInfo', function(req, res) {
	multichain.getNetworkInfo(function(err, info) {
		if(err){
			res.json(err);
		}
		else {
			res.json(info);
		}
	});
});

app.get('/getAddresses', function(req, res) {
	multichain.getAddresses(function(err, info) {
		if(err){
			res.json(err);
		}
		else {
			res.json(info);
		}
	});
});

app.get('/getMiningInfo', function(req, res) {
	multichain.getMiningInfo(function(err, info) {
		if(err){
			res.json(err);
		}
		else {
			res.json(info);
		}
	});
});

app.get('/getPeerInfo', function(req, res) {
	multichain.getPeerInfo(function(err, info) {
		if(err){
			res.json(err);
		}
		else {
			res.json(info);
		}
	});
});

app.get('/listStreams', function(req, res) {
	multichain.listStreams(function(err, info) {
		if(err){
			res.json(err);
		}
		else {
			res.json(info);
		}
	});
});

app.get('/listPermissions', function(req, res) {
	multichain.listPermissions(function(err, info) {
		if(err){
			res.json(err);
		}
		else {
			res.json(info);
		}
	});
});

app.get('/listAssets', function(req, res) {
	multichain.listAssets(function(err, info) {
		if(err){
			res.json(err);
		}
		else {
			res.json(info);
		}
	});
});

app.get('/listAssetTransactions', function(req, res) {
	multichain.listAssetTransactions({asset: "115-266-56597"}, function(err, info) {
		if(err){
			res.json(err);
		}
		else {
			res.json(info);
		}
	});
});

app.get('/subscribe', function(req, res) {
	multichain.subscribe({asset: "104-265-37773"}, function(err, info) {
		if(err){
			res.json(err);
		}
		else {
			res.json(info);
		}
	});
});

app.get('/listStreamKeys/:streamName', function(req, res) {
	multichain.listStreamKeys({stream: req.params.streamName},function(err, info) {
		if(err){
			res.json(err);
		}
		else {
			res.json(info);
		}
	});
});

app.get('/listStreamItems/:streamName', function(req, res) {
	multichain.listStreamItems({stream: req.params.streamName, verbose: true, start: 0, count: 999 },function(err, info) {
		if(err){
			res.json(err);
		}
		else {
			let result = [];
            let items = {};
            let itemName = "";
			for(let i=0; i < info.length; i++) {
				itemName = JSON.parse(conv(info[i].data, { in:'hex', out:'utf8' }));
				console.log(itemName);
				items = {key: info[i].keys, data: itemName}
				result.push(items);
				console.log(result);
            }
            try {
               // itemName=JSON.parse(itemName);
			    res.json(result);
            } catch (e) {
                console.log("not JSON");
                res.json(itemName);
            }

           
		}
	});
});

app.post('/listStreamLatestItem/:streamName/:key',function(req,res){
    var streamName = req.params.streamName;
    var streamKey = req.params.key;
   console.log("inside lateststream prev method");
    multichain.listStreamKeyItems({stream: streamName,key: streamKey},function(err, info) {
		if(err){
			res.json(err);
		}
		else {
            
			let result = [];
            let items = {};
            let nodeData = "";
            console.log(info[info.length-1].blocktime);
				nodeData = conv(info[info.length-1].data, { in:'hex', out:'utf8' });
				console.log("nodedate in latest function : "+nodeData);
                nodeData=JSON.parse(nodeData);
                
			res.json(nodeData);
		}
	});
});


    
    function changeStatus(streamName, key, status) {
		console.log("inside change status");
        var chunk="";
        //var status = status ;
        var url = '/listStreamLatestItem/purchaseorders/'+key;
        console.log('url'+url);
        console.log("status pushed" + status);
        var options = {
            host: '',
            port: 3000,
            path: url,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            
          };
          //result = '';
          http.request(options, function(res) {
            
            //result = "";
            res.on('data', function (chunk) {
				console.log('CHUNK : ' + chunk);
              chunk =JSON.parse(chunk);
              console.log('initial JSON' + chunk);
              console.log("initial status"+chunk.STATUS);
			  chunk.STATUS = status;
			  //var datetime = new Date();
			  //chunk.STATUS = status;
              console.log('final JSON' + JSON.stringify(chunk));
              //result=chunk;
              //res.setEncoding('utf8');
              //result = chunk;
            });
           // res.json(res);
            
		  }).end();
		  console.log("chunk : "+chunk);
        return chunk;
        }

app.post('/publish/:streamName', function(req, res) {
		console.log("inside publish");
         var keyToPublish = req.body.KEY;
		 var dataToPublish = req.body.DATA;
		 var statustoBePublished = req.body.DATA.STATUS;
         
         var dataToPublishString= JSON.stringify(dataToPublish);
         var keyToPublishString= keyToPublish;
		 
		 
		 var streamName = req.params.streamName;
		 var dataToadd = "";
		 console.log("keyToPublishString : "+keyToPublishString);
		 console.log("stream : "+streamName);
		 var initializePromise = getLatestItem(streamName,keyToPublishString);
    initializePromise.then(function(result) {
        
		console.log("result from promise : "+result);
		result =JSON.parse(result);
		console.log("status : "+result.STATUS);
		console.log("status to be published: "+statustoBePublished);
		result.STATUS = statustoBePublished;
		result = JSON.stringify(result);
		console.log("new data : "+result);
		
		dataToadd = new Buffer(result).toString("hex"); 
		console.log("dataToAdd : "+dataToadd);
		if ((keyToPublish == undefined) || (dataToadd == undefined)|| (streamName == undefined)) {
			return res.send(400, "Please insert a data and key in the POST body to publish.");
		} else {          
			console.log(streamName);
			console.log(dataToadd);
			console.log(keyToPublish);
			 multichain.publish({stream: streamName, key: keyToPublish, data: dataToadd},function(err, info) {
						if(err){
							console.log("err : "+err);
							res.json(err);
						}
						else {
							console.log("info : "+info);
							res.json(info);
						}
					});

		};


    });

 });
 
 app.get('/activityStream/:source/:status/:ponumber/:target', function(req, res) {
    let stringData = '';

switch(req.params.status) {
case "created": 
 stringData = `<b>${req.params.source}</b> <b>${req.params.status}</b> Purchase Order No. <b>${req.params.ponumber}</b> with <b>${req.params.target}</b>`;
 
 break;
case "confirmed":
 stringData = `<b>${req.params.source}</b> <b>${req.params.status}</b> Purchase Order No. <b>${req.params.ponumber}</b> for <b>${req.params.target}</b>`;
 
 break;
case "processing":
 stringData = `<b>${req.params.source}</b> is <b>${req.params.status}</b> Purchase Order No. <b>${req.params.ponumber}</b> for <b>${req.params.target}</b>. ETA for pickup: <b>19-July</b>`;
 
 break;
case "ready to send":
 stringData = `<b>${req.params.source}</b> is <b>${req.params.status}</b> Purchase Order No. <b>${req.params.ponumber}</b> to <b>${req.params.target}</b>`;
 
 break;
case "picked up":
 stringData = `<b>${req.params.source}</b> has <b>${req.params.status}</b> shipment for Purchase Order No. <b>${req.params.ponumber}</b> to be delivered to  <b>${req.params.target}</b>. ETA for delivery: <b>20-July 4:00 PM</b>`;
 
 break;
case "delivered":
 stringData = `<b>${req.params.source}</b> <b>${req.params.status}</b> shipment for Purchase Order No. <b>${req.params.ponumber}</b> to <b>${req.params.target}</b>`;
 
 break;
case "received":
 stringData = `<b>${req.params.source}</b> <b>${req.params.status}</b> shipment for Purchase Order No. <b>${req.params.ponumber}</b> from <b>${req.params.target}</b>`;
 
 break;
}
    
let hexData = conv(stringData, { in:'utf8', out:'hex' });
    console.log(hexData);

multichain.publish({stream: "activitystream", key: req.params.ponumber, data: hexData},function(err, info) {
                   if(err){
                                  res.json(err);
                   }
                   else {
                                  res.json(info);
                   }
    });
});

app.get('/issue', function(req, res) {
	multichain.issue({address: "15Qtsa2WHmfDBohpetVUdUqixUsaBtxNkmDThs", asset: "zcoin", qty: 50000, units: 1, details: {name: "zcoin", cost: 10, uom: "EACH"}}, (err, res) => {
		//console.log(res);
		res.json("Success");
	})
});

app.get('/issue2', function(req, res) {
	multichain.issue({address: "15Qtsa2WHmfDBohpetVUdUqixUsaBtxNkmDThs", asset: "zcoin2", qty: 50000, units: 1, details: {name: "zcoin2", cost: 10, uom: "EACH"}}, (err, res) => {
		//console.log(res);
		res.json("Success");
	})
});

app.get('/grant/:address/:permission/:stream', function(req, res) {
	var permName = req.params.permission;

	if(req.params.stream != undefined)
		permName = req.params.stream + '.' + permName;

	console.log(permName);
	multichain.grant({addresses: req.params.address, permissions: permName}, (err, resp) => {
		console.log(resp);
		res.json("Success");
	})
});

app.get('/revoke/:address/:permission/:stream', function(req, res) {

	var	permName = req.params.stream + '.' + req.params.permission;

	console.log(permName);
	multichain.revoke({addresses: req.params.address, permissions: permName}, (err, resp) => {
		console.log(resp);
		res.json("Success");
	})
});

app.get('/grant/:address/:permission', function(req, res) {
	multichain.grant({addresses: req.params.address, permissions: req.params.permission}, (err, resp) => {
		console.log(resp);
		res.json("Success");
	})
});

app.get('/revoke/:address/:permission', function(req, res) {
	multichain.revoke({addresses: req.params.address, permissions: req.params.permission}, (err, resp) => {
		console.log(resp);
		res.json("Success");
	})
});

app.get('/create/:streamname', function(req, res) {
	multichain.create({type: 'stream', name: req.params.streamname, open: true}, (err, resp) => {
		console.log(resp);
		res.json("Success");
	})
});

app.get('/listStreamKeyItems/:streamName/:key', function(req, res) {
	    multichain.listStreamKeyItems({stream: req.params.streamName, key: req.params.key },function(err, info) {
	        if(err){
	            res.json(err);
	        }
	        else {
	            let result = [];
	            let items = {};
	            for(let i=0; i < info.length; i++) {
	                let itemName = JSON.parse(conv(info[i].data, { in:'hex', out:'utf8' }));
	                //console.log(itemName);
	                items = {key: info[i].keys, data: itemName}
	                result.push(items);
	                //console.log(result);
	            }
	            res.json(result);
	        }
	    });
	}); 
	
var getLatestItem = function(streamName, keyName) {
	console.log("inside latestiterm");
	var options = {
		url: 'http://ec2-35-154-249-127.ap-south-1.compute.amazonaws.com:3000/listStreamLatestItem/'+streamName+'/'+keyName,
		headers: {
			'User-Agent': 'request'
		}
	};
		// Return new promise 
		console.log("options.url : "+options.url);
	return new Promise(function(resolve, reject) {
		// Do async job
		request.post(options, function(err, resp, body) {
			if (err) {
				reject(err);
			} else {
				resolve(body);
			}
		})
	 });
}

app.listen(port);