exports.addIntention = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //判断是否已经添加过活动意向
        function(cb){

            db.where(bodyParams).select("mu_activity_intention",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"意向报名失败");
                }

                if(result.length > 0){
                    return RES.response(res,false,"您已有过意向报名");
                }

                cb();

            });

        },

        //添加活动意向
        function(cb){

            var addParams = {
                ai_aid         : bodyParams.ai_aid,
                ai_uid         : bodyParams.ai_uid,
                ai_create_time : common.nowTime(false)
            }

            db.add(addParams,"mu_activity_intention",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"意向报名失败");
                }

                cb();

            });

        },

        //更新活动意向总数
        function(cb){

            db.where({"a_id":bodyParams.ai_aid}).update({"a_interest_user_count" : "'a_interest_user_count' + 1"},"mu_activity",function(result){
                cb();
            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}