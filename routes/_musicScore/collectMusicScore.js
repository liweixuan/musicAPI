exports.collectMusicScore = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //条件
    var searchParams = { dc_id : bodyParams.dc_id }; 

    //构建任务流
    async.waterfall([

        //查看是否收藏过该曲谱
        function(cb){

            db.where({"cms_msid":bodyParams.ms_id,"cms_uid":bodyParams.u_id}).count("mu_collect_music_score",function(result){
                if(result == 'ERROR'){
                    return RES.response(res,false,"曲谱收藏失败");
                }

                if(result > 0){
                    return RES.response(res,false,"您已收藏过该曲谱了");
                }

                cb();
            });

        },

        //收藏曲谱
        function(cb){

            var addParams = {
                cms_msid : bodyParams.ms_id,
                cms_uid  : bodyParams.u_id
            };

            db.add(addParams,"mu_collect_music_score",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"曲谱收藏失败");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}