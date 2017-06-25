exports.getToken = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    var resultData = {};

    //构建任务流
    async.waterfall([

        //从融云服务器注册TOKEN
        function(cb){
            rongcloudSDK.user.getToken(bodyParams.userId,bodyParams.name,bodyParams.portraitUri,function(err,resultText) {
                
                if(err){
                    return RES.response(res,false,"融云服务器注册失败");
                }else{
                    var result = JSON.parse(resultText);
                    if( result.code === 200 ) {
                        resultData = {
                            rongCloudToken : result.token
                        }
                    }

                    cb();
                }
            });
        }
    ], function (err, result) {
        return RES.response(res, true,resultData);
    });

}