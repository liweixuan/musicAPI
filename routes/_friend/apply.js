exports.apply = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //申请添加好友
        function(cb){

            

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}