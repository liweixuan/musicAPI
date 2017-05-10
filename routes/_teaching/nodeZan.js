exports.nodeZan = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //条件
    var searchParams = { iln_id : bodyParams.iln_id }; 

    //构建任务流
    async.waterfall([

        //为评论点赞
        function(cb){

            db.where(searchParams).update({"iln_zan_count" : "iln_zan_count + 1"},"mu_instruments_level_node",function(result){

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