module.exports = function(){

	mongoose.Promise = global.Promise;

	//连接mongodb
	mongoose.connect(config.mongodb.uri);

	//导入相关模型设计
	require("../models/userLocation.server.model");
	
};