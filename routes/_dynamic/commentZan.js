exports.commentZan = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //条件
    var searchParams = { dc_id : bodyParams.dc_id }; 

    //构建任务流
    async.waterfall([

        //为评论点赞
        function(cb){

            db.where(searchParams).update({"dc_zan_count" : "'dc_zan_count' + 1"},"mu_dynamic_comment",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"动态评论点赞失败");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}