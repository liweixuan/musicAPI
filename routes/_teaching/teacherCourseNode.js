exports.teacherCourseNode = function(req,res) {

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    var nodeData = {};

    //构建任务流
    async.waterfall([

        //获取节点课程信息
        function(cb){

            db.where({"tcn_tcsid":restful.tcn_tcsid,"tcn_is_enable":1}).order("tcn_order asc").select("mu_teacher_cource_node",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"课程节点获取失败");
                }

                nodeData = result;

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true, nodeData);
    });

}