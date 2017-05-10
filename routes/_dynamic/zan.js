exports.zan = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //条件
    var searchParams = { d_id : bodyParams.d_id }; 

    //构建任务流
    async.waterfall([

        //为评论点赞
        function(cb){

            db.where(searchParams).update({"d_zan_count" : "d_zan_count + 1"},"mu_dynamic",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"动态点赞失败");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}