exports.searchStage = function(req,res) {

    //获取restful参数
	var restful = req.routeInfo.restfulParams;

    var userStageData = {};

    //构建任务流
    async.waterfall([

        //获取用户是否购买开通了该乐器
        function(cb){

            db.where({"ui_uid":restful.u_id,"ui_cid":restful.c_id}).select("mu_user_buy_instruments",function(result){
                if(result == 'ERROR'){
                    return RES.response(res,false,"是否购买查询失败");
                }

                console.log(result);

                if(result.length <= 0){
                    userStageData.buy = { isBuy : 0 };
                }else{
                    userStageData.buy = { isBuy : 1, endTime : result[0].ui_end_time };
                }
                
                cb();
            });

        },

        //获取教师信息
        function(cb){

            db.where({"il_cid":restful.c_id}).order("il_level asc").select("mu_instruments_level",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"乐器阶段信息获取失败");
                }

                userStageData.stage = result;

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true, userStageData);
    });

}