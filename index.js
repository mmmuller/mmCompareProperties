#!/usr/bin/env node
var fs = require('fs');
var myArgs = process.argv;

var readFile = function(file) {
	return fs.readFileSync(file).toString().split("\n");
};

var fillFilesContainer = function(fsc) {
	for ( var i in fsc) {
		var fc = fsc[i];
		var rows = readFile(fc.name);
		for ( var ii in rows) {
			fc.rows.push({
				line : rows[ii],
				key : rows[ii].substr(0, rows[ii].indexOf(' '))
			});
		}
	}
};

var getFilesContainer = function(files) {
	var filesMap = [];
	for ( var i in files) {
		val = files[i];
		filesMap.push({
			name : val,
			rows : [],
			key : undefined
		});
	}
	fillFilesContainer(fillFilesContainer(filesMap));
	return filesMap;
};

var validArguments = function(myArgs) {
	if (myArgs.length < 3) {
		console.log("You have to add at least 1 files in params!!!");
		process.exit(1);
	}
	myArgs = myArgs.splice(0, 2);
};

var getKeyExistingInRows = function(rows, v) {
	var count = 0;
	for ( var i in rows) {
		if (rows[i].key === v) {
			count++;
		}
	}
	return count;
};

var searchRedundant = function(filesContainer) {
	for ( var i in filesContainer) {
		var fileContainer = filesContainer[i];
		for ( var ii in fileContainer.rows) {
			var row = fileContainer.rows[ii];
			if (row.key === "")
				continue;
			if (getKeyExistingInRows(fileContainer.rows, row.key) > 1) {
				console.log("W pliku " + fileContainer.name + " powtarza się: "
						+ row.key);
			}
		}
	}
};

var getAllKey = function(filesContainer) {
	var allKeys = [];
	for ( var i in filesContainer) {
		var fileContainer = filesContainer[i];
		for ( var ii in fileContainer.rows) {
			var row = fileContainer.rows[ii];
			if (row.key === "")
				continue;
			if (allKeys.indexOf(row.key) === -1)
				allKeys.push(row.key);
		}
	}
	return allKeys;
};

var searchMissingKeysInFiles = function(filesContainer) {
	var allKeys = getAllKey(filesContainer);
	var countMissing = 0;
	for ( var x in allKeys) {
		for ( var i in filesContainer) {
			var fileContainer = filesContainer[i];
			if (getKeyExistingInRows(fileContainer.rows, allKeys[x]) === 0) {
				console.log("W pliku " + fileContainer.name
						+ " brakuje klucza " + allKeys[x]);
				countMissing++;
			}
		}
	}
	console.log("-------------------------------------------");
	console.log("Brakuje w sumie " + countMissing + " kliczy w plikach");
};

validArguments(myArgs);
var filesContainer = getFilesContainer(myArgs);
searchRedundant(filesContainer);
searchMissingKeysInFiles(filesContainer);

