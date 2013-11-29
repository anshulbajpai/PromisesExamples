var isExceptionCase  = function() {
	return Math.floor((Math.random()*100)+1) % 2 == 0;
};

var fetchFromMemory = function(callback) {
	if(isExceptionCase()){
		throw "Memory fetch failed";
	}
	setTimeout(function() {
		callback('This is data from memory')
	}, 3000);
};

var fetchFromRemoteCall = function(callback) {
	if(isExceptionCase()){
		throw "Remote call failed";
	}
	setTimeout(function() {
		callback('This is data from remote call')
	}, 3000);
};

var printData = function(data) {
	console.log(data)
};

var readWrite = function() {
	var startMilis = new Date().getTime();
	try{
		fetchFromMemory(function(memoryData) {
			
			try {
				fetchFromRemoteCall(function(remoteCallData) {
					printData(memoryData + "-" + remoteCallData);
					printOperationDuration(startMilis);
				});
			}
			catch(err){
				console.log("GOOOO");
			}
			
		})
	}	
	catch(err){
		console.log("BOOOOO");
	}
};

var printOperationDuration = function(startMilis) {
	var endMilis = new Date().getTime();
	var seconds = (endMilis - startMilis) / 1000;
	console.log("Operation took " + seconds + " seconds.");
};

readWrite();
