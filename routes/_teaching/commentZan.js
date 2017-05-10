exports.commentZan = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //条件
    var searchParams = { ilnc_id : bodyParams.ilnc_id }; 

    //构建任务流
    async.waterfall([

        //为评论点赞
        function(cb){

            db.where(searchParams).update({"ilnc_zan_count" : "ilnc_zan_count + 1"},"mu_instruments_level_node_comment",function(result){

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