exports.add = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //添加找伙伴信息
        function(cb){

            bodyParams.a_create_time = common.nowTime(false);

            db.add(bodyParams,"mu_activity",function(result){
                if(result == 'ERROR'){
                    return RES.response(res,false,"活动创建失败");
                }
                cb();
            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}