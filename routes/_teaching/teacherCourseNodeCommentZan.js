exports.teacherCourseNodeCommentZan = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //条件
    var searchParams = { tcnc_id : bodyParams.tcnc_id }; 

    //构建任务流
    async.waterfall([

        //为评论点赞
        function(cb){

            db.where(searchParams).update({"tcnc_zan_count" : "tcnc_zan_count + 1"},"mu_teacher_cource_node_comment",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"课程评论点赞失败");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}