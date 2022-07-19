"use strict";
Object.defineProperty(exports, "__esModule", {value: true});

exports.default = SPHttpClientBatch;
var lodash = require('@microsoft/sp-lodash-subset');
var sp_core_library_1 = require("@microsoft/sp-core-library");
var BatchedRequest_1 = require('./BatchedRequest');
var SPHttpClient_1 = require("@microsoft/sp-http/dist/")