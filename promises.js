var Q = require('q');

var isExceptionCase  = function() {
	return Math.floor((Math.random()*100)+1) % 2 == 0;
};

var fetchFromMemoryPromise = function() {
	var deferred = Q.defer();
	setTimeout(function() {
		if(isExceptionCase()){
			deferred.reject("Memory fetch failed");	
		}else{
			deferred.resolve('This is data from memory');
		}
	}, 3000);
	return deferred.promise;
};

var fetchFromRemoteCallPromise = function() {
	var deferred = Q.defer();
	setTimeout(function() {
		if(isExceptionCase()){
			deferred.reject("Remote call failed");	
		}else{
			deferred.resolve('This is data from remote call');
		}
	}, 3000);
	return deferred.promise;
};

var printData = function(data) {
	console.log(data)
};

var readWriteWithChaining = function() {
	var memoryData;
	var startMilis = new Date().getTime();
	fetchFromMemoryPromise()
	.then(function(data) {
		memoryData = data;
		return fetchFromRemoteCallPromise();
	})
	.then(function(data) {
		printData(memoryData + "-" + data);
		printOperationDuration(startMilis);
	})
	.fail(function(reason) {
		console.log(reason);
	});
};

var readWriteWithNesting = function() {
	var startMilis = new Date().getTime();
	fetchFromMemoryPromise()
	.then(function(memoryData) {
		return fetchFromRemoteCallPromise()
		.then(function(remoteData) {
			printData(memoryData + "-" + remoteData);
			printOperationDuration(startMilis);
		})
	})
	.fail(function(reason) {
		console.log(reason);
	});
};

var readWriteWithSpread = function() {
	var startMilis = new Date().getTime();
	fetchFromMemoryPromise()
	.then(function(data) {
		return [data, fetchFromRemoteCallPromise()];
	})
	.spread(function(memoryData, remoteData) {
		printData(memoryData + "-" + remoteData);
		printOperationDuration(startMilis);
	})
	.fail(function(reason) {
		console.log(reason);
	});
};

var readWriteParallelWithFailFast = function() {
	var startMilis = new Date().getTime();
	var memoryPromise = fetchFromMemoryPromise();
	var remotePromise = fetchFromRemoteCallPromise();

	Q.all([memoryPromise, remotePromise])
	.spread(function(memoryData, remoteData) {
		printData(memoryData + "-" + remoteData);
		printOperationDuration(startMilis);
	})
	.fail(function(reason) {
		console.log(reason);
	});
};

var readWriteParallel = function() {
	var startMilis = new Date().getTime();
	var memoryPromise = fetchFromMemoryPromise();
	var remotePromise = fetchFromRemoteCallPromise();

	Q.allSettled([memoryPromise, remotePromise])
	.then(function(results) {
		results.forEach(function(result) {
			if(result.state === "fulfilled"){
				printData(result.value);
			}
			else{
				printData(result.reason);
			}
		});
		printOperationDuration(startMilis);
	})
};

var printOperationDuration = function(startMilis) {
	var endMilis = new Date().getTime();
	var seconds = (endMilis - startMilis) / 1000;
	console.log("Operation took " + seconds + " seconds.");
};

readWriteParallel();
