exports.upgradeMusicScore = function(req,res) {

    //获取restful参数
    var restfulParams = req.routeInfo.restfulParams;

    var upgradeMusicScoreData = [];

    //构建任务流
    async.waterfall([

        //获取升级演奏曲谱的级别主键
        function(cb){

            db.where({"uclms_cid":restfulParams.uclms_cid,"uclms_level":restfulParams.uclms_level}).select("v_upgrade_music_score_info",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"评测乐谱获取失败");
                }

                upgradeMusicScoreData = result;

                cb();


            });
        }

    ], function (err, result) {
        return RES.response(res, true,upgradeMusicScoreData);
    });

}