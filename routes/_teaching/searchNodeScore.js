exports.searchNodeScore = function(req,res) {

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    //查询条件
    var searchParams = {};

    //增加类型查询条件
    searchParams.ilns_type = restful.ilns_type;

    //获取未删除的
    searchParams.ilns_is_delete = 0;

    //所属的课程节点ID
    searchParams.ilns_ilnid = restful.ilns_ilnid;

    var nodeScoreData = [];

    //构建任务流
    async.waterfall([

        //获取教师信息
        function(cb){

            db.where(searchParams).order("ilns_order asc").select("mu_instruments_level_node_score",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"曲谱信息获取失败");
                }

                nodeScoreData = result;

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true, nodeScoreData);
    });

}