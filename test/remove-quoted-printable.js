var assert = require('assert');
var parser = require("../");
var iconv = require("iconv-lite");
var fs = require("fs");
var deepDiff = require("deep-diff");


function newDeepDiff(lhs, rhs) {
	return deepDiff.observableDiff(lhs, rhs, function (d) {
		if (d.kind == "E" && (d.path[d.path.lenth - 1] == "startPosition" || d.path[d.path.lenth - 1] == "bufferLength")) {
			deepDiff.applyChange(lhs, rhs, d);
		}
	});
}

describe('Remove Quoted-printable', function () {
	var json = JSON.parse(fs.readFileSync(__dirname + '/simple/simple-removedQuotedPrintable.json', 'utf-8'));//require("./simple/simple-removedQuotedPrintable.json");
	it('JSON should be equal', function (done) {
		parser.loadFile(__dirname + "/simple/simple.mht", {
			charset: "gbk",
			decodeQuotedPrintable: true
		}, function (err, data) {
			if (err) throw err;
			if (process.env.SAVE_JSON) {
				fs.writeFile(__dirname + '/simple/simple-removedQuotedPrintable.json', JSON.stringify(data), 'utf-8');
				done();
				return;
			}
			var ret = newDeepDiff(data, json);
			if (typeof ret == "undefined" || ret === null) {
				done();
			} else {
				console.error(ret);
				throw "Not Equal";
			}
		});
	});

});