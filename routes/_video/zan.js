exports.zan = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //条件
    var searchParams = { v_id : bodyParams.v_id }; 

    //构建任务流
    async.waterfall([

        //为视频点赞
        function(cb){

            db.where(searchParams).update({"v_zan_count" : "v_zan_count + 1"},"mu_video",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"视频点赞失败");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}