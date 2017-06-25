exports.partake = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //当前时间戳
    var nowtime = common.nowTime(false);

    //构建任务流
    async.waterfall([

        //检测是否已参与过
        function(cb){

            db.where({"mpu_mid":bodyParams.mpu_mid,"mpu_uid":bodyParams.mpu_uid}).count("mu_match_partake_user",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"比赛参与失败");
                }

                if(result > 0){
                    return RES.response(res,false,"您已参与过该比赛了");
                }
                
                cb();


            });

        },

        //参与比赛
        function(cb){

            var addMatchParams = {
                mpu_mid         : bodyParams.mpu_mid,
                mpu_uid         : bodyParams.mpu_uid,
                mpu_video_url   : bodyParams.mpu_video_url,
                mpu_create_time : nowtime 
            };

            db.add(addMatchParams,"mu_match_partake_user",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"比赛参与失败");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}