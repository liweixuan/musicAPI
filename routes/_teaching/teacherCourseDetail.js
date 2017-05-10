exports.teacherCourseDetail = function(req,res) {

    //获取restful参数
	var restful = req.routeInfo.restfulParams;

    var nodeDetailData = {};

    //构建任务流
    async.waterfall([

        //获取教师信息
        function(cb){

            var userField = [
                "u_id",
                "u_username",
                "u_nickname",
                "u_sex",
                "u_header_url",
                "u_province",
                "u_city",
                "u_district"
            ];


            db.field(userField).where({"u_id":restful.teacher_id}).select("mu_users",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"课程详情获取失败");
                }

                nodeDetailData.user = result[0];

                cb();

            });

        },

        //获取节点课程详细
        function(cb){

            db.where({"tcn_id":restful.tcn_id}).select("mu_teacher_cource_node",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"课程详情获取失败");
                }

                nodeDetailData.node = result[0];

                cb();
            });
        }

    ], function (err, result) {
        return RES.response(res, true, nodeDetailData);
    });

}