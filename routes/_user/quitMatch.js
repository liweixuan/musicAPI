exports.quitMatch = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //退出比赛修改
        function(cb){

            var updateParams = {
                mpu_is_delete : 1
            };

            db.where({"mpu_mid":bodyParams.m_id,"mpu_uid":bodyParams.u_id}).update(updateParams,"mu_match_partake_user",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"比赛退出失败");
                }

                
                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}