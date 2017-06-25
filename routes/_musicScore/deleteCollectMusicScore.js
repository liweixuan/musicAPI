exports.deleteCollectMusicScore = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //条件
    var searchParams = { cms_id : bodyParams.cms_id }; 

    //构建任务流
    async.waterfall([

        function(cb){

            db.where(searchParams).del("mu_collect_music_score",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"曲谱删除失败");
                }

                cb();
            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}