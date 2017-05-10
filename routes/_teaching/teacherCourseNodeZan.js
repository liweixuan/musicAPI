exports.teacherCourseNodeZan = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //条件
    var searchParams = { tcn_id : bodyParams.tcn_id }; 

    //构建任务流
    async.waterfall([

        //为课程点赞
        function(cb){

            db.where(searchParams).update({"tcn_zan_count" : "tcn_zan_count + 1"},"mu_teacher_cource_node",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"课程点赞失败");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}