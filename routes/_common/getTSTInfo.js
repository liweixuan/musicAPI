var ALY = require("aliyun-sdk");

exports.getTSTInfo = function (req, res) {

        var bodyParams = req.routeInfo.bodyParams;

        //最终获取到的TST信息
        var TSTData = {};

        //构建任务流
        async.waterfall([

                //获取TST信息
                function (cb) {

                        var sts = new ALY.STS({
                                accessKeyId: config.ossConfig.app_key,
                                secretAccessKey: config.ossConfig.app_secret,
                                endpoint: config.ossConfig.endpoint,
                                apiVersion: config.ossConfig.apiVersion
                        });

                        // 构造AssumeRole请求
                        sts.assumeRole({
                                Action: 'AssumeRole',
                                RoleArn: config.ossConfig.roleArn,
                                DurationSeconds: config.ossConfig.effectiveTime,
                                RoleSessionName: 'RoleSessionName'
                        }, function (err, data) {

                                if (err) {
                                   return RES.response(res, false, err.message);          
                                }

                                TSTData = data;

                                cb();
                        });
                }

        ], function (err, result) {
                return RES.response(res,true,TSTData);
        });
}