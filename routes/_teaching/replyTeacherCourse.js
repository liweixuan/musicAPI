exports.replyTeacherCourse = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //评论课程
        function(cb){

            var addParams = {
                tcnc_content     : bodyParams.tcnc_content,
                tcnc_uid         : bodyParams.tcnc_uid,
                tcnc_tcnid       : bodyParams.tcnc_tcnid,
                tcnc_create_time : common.nowTime(false)
            } 

            db.add(addParams,"mu_teacher_cource_node_comment",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"评论失败");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}