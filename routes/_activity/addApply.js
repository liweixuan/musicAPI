exports.addApply = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //判断是否已经添加过活动意向
        function(cb){

            db.where({"aa_uid":bodyParams.aa_uid,"aa_aid":bodyParams.aa_aid}).select("mu_activity_apply",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"活动报名失败");
                }

                if(result.length > 0){
                    return RES.response(res,false,"您已报名过该活动了");
                }

                cb();

            });

        },

        //添加活动意向
        function(cb){

            var addParams = {
                aa_aid         : bodyParams.aa_aid,
                aa_uid         : bodyParams.aa_uid,
                aa_note        : bodyParams.aa_note == undefined ? "" : bodyParams.aa_note,
                aa_create_time : common.nowTime(false)
            }

            db.add(addParams,"mu_activity_apply",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"活动报名失败");
                }

                cb();

            });

        },

        //更新活动意向总数
        function(cb){

            db.where({"a_id":bodyParams.aa_aid}).update({"a_apply_user_count" : "'a_apply_user_count' + 1"},"mu_activity",function(result){
                cb();
            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}