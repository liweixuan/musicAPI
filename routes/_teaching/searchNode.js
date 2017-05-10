exports.searchNode = function(req,res) {

    //获取restful参数
	var restful = req.routeInfo.restfulParams;

    var nodeData = [];

    //构建任务流
    async.waterfall([

        //获取教师信息
        function(cb){

            db.where({"iln_ilid":restful.iln_ilid,"iln_is_enable":1}).order("iln_order asc").select("mu_instruments_level_node",function(result){

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