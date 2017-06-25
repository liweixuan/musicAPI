exports.zan = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //条件
    var searchParams = { a_id : bodyParams.a_id }; 

    //构建任务流
    async.waterfall([

        //为文章点赞
        function(cb){

            db.where(searchParams).updateInc("a_zan_count","mu_article",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"文章点赞失败");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}