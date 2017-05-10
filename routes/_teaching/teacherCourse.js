exports.teacherCourse = function(req,res) {

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    var teacherData = {};

    //构建任务流
    async.waterfall([

        //获取教师信息
        function(cb){

            var userFields = [
                "u_id",
                "u_username",
                "u_nickname",
                "u_sex",
                "u_province",
                "u_city",
                "u_district"
            ];

            db.field(userFields).where({"u_id":restful.teacher_id}).select("mu_users",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"课程信息获取失败");
                }

                teacherData.detail = result[0];

                cb();

            });

        },

        //获取教师下的课程列表
        function(cb){

            db.where({"tc_uid":restful.teacher_id,"tc_is_delete":0,tc_is_audit:1}).select("mu_teacher_course",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"课程信息获取失败");
                }

                teacherData.course = result;

                cb();

            });


        }

    ], function (err, result) {
        return RES.response(res, true, teacherData);
    });

}