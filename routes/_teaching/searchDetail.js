exports.searchDetail = function(req,res) {

    //获取restful参数
	var restful = req.routeInfo.restfulParams;

    var nodeDetailData = [];

    //构建任务流
    async.waterfall([

        //获取教师信息
        function(cb){

            db.where({"iln_id":restful.iln_id,"iln_is_enable":1}).select("v_instruments_level_node_user",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"课程详情获取失败");
                }

                nodeDetailData = result[0];

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true, nodeDetailData);
    });

}