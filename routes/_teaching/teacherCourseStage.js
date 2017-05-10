exports.teacherCourseStage = function(req,res) {

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    var stageData = {};

    //构建任务流
    async.waterfall([

        //查看用户是否购买了该课程
        function(cb){

            db.where({"ubtc_uid":restful.u_id,"ubtc_cid":restful.tcs_tcid}).select("mu_user_buy_teacher_course",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"课程阶段获取失败");
                }

                if(result.length > 0){
                    stageData.buy = { isBuy : true };
                }else{
                    stageData.buy = { isBuy : false };
                }

                cb();

            });


        },

        //获取阶段信息
        function(cb){

            db.where({"tcs_tcid":restful.tcs_tcid}).order("tcs_level asc").select("mu_teacher_course_stage",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"课程阶段获取失败");
                }

                stageData.stage = result;

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true, stageData);
    });

}