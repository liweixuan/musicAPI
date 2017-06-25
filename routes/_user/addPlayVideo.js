exports.addPlayVideo = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //添加个人演奏集
        function(cb){

            var addParams = {
                upv_url         : bodyParams.upv_url,
                upv_name        : bodyParams.upv_name,
                upv_uid         : bodyParams.upv_uid,
                upv_image_url   : bodyParams.upv_image_url,
                upv_create_time : common.nowTime(false)
            }

            db.add(addParams,"mu_user_play_video",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"演奏集视频添加失败");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}