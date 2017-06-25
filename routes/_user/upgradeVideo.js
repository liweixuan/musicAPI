exports.upgradeVideo = function(req,res) {

    //获取restful参数
	var restful = req.routeInfo.restfulParams;

    var playVideoData = [];

    //构建任务流
    async.waterfall([

        //获取个人演奏集信息
        function(cb){

            db.where({"uuv_uid":restful.uuv_uid,uuv_status:2,"uuv_cid":restful.uuv_cid}).order("uuv_level asc").select("mu_user_upgrade_video",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"获取升级演奏视频失败");
                }

                playVideoData = result;

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true, playVideoData);
    });

}