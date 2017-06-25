exports.getMusicScoreDetail = function(req,res) {

    //获取body参数
    var restful = req.routeInfo.restfulParams;

	var musicScoreDetail = {};

    //构建任务流
    async.waterfall([

        //获取曲谱详细
        function(cb){

            db.where({"msi_msid":restful.ms_id}).order("msi_order asc").select("mu_music_score_image",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"曲谱详细获取失败");
                }

                musicScoreDetail = result;

                cb();

            });

        }
    ], function (err, result) {
        return RES.response(res, true, musicScoreDetail);
    });

}