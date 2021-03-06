exports.add = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //添加找伙伴信息
        function(cb){

            bodyParams.fp_create_time = common.nowTime(false);

            db.add(bodyParams,"mu_find_partner",function(result){
                if(result == 'ERROR'){
                    return RES.response(res,false,"新增找伙伴信息失败");
                }
                cb();
            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}