exports.allInstrumentLevel = function(req,res) {

    //获取restful参数
    var restfulParams = req.routeInfo.restfulParams;

    var allInstrumentLevelData = {};

    //构建任务流
    async.waterfall([

        //获取当前用户的乐器等级
        function(cb){

            db.where({"ul_uid":restfulParams.u_id}).select("mu_user_level",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"乐器等级信息获取失败");
                }

                allInstrumentLevelData = result;

                cb();


            });
        }

    ], function (err, result) {
        return RES.response(res, true,allInstrumentLevelData);
    });

}