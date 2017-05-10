exports.addTeacherCourseQuestions = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //添加课程提问
        function(cb){

            var addParams = {
                tcnq_content     : bodyParams.tcnq_content,
                tcnq_uid         : bodyParams.tcnq_uid,
                tcnq_create_time : common.nowTime(false),
                tcnq_teacherId   : bodyParams.tcnq_teacherId
            };

            db.add(addParams,"mu_teacher_cource_node_questions",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"提问成功，等待回复");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}