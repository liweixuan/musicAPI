exports.matchVote = function(req,res) {

    //获取参数
    var bodyParams = req.routeInfo.bodyParams;

    //当前时间戳
    var nowtime = common.nowTime(false);

    //构建任务流
    async.waterfall([

        //查看是否已投过票
        function(cb){

            db.where({
                "mv_mid":bodyParams.mv_mid,
                "mv_voter_id":bodyParams.mv_voter_id,
                "mv_votee_id":bodyParams.mv_votee_id
            }).count("mu_match_vote",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"比赛投票失败");
                }

                if(result > 0){
                    return RES.response(res,false,"您已给该用户投过票了");
                }

                cb();

            });
        },

        //添加投票
        function(cb){

            var addParams = {
                "mv_mid"         : bodyParams.mv_mid,
                "mv_voter_id"    : bodyParams.mv_voter_id,
                "mv_votee_id"    : bodyParams.mv_votee_id,
                "mv_create_time" : nowtime
            };

            db.add(addParams,"mu_match_vote",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"比赛投票失败");
                }

                cb();

            });
        },

        //更新用户被投票数
        function(cb){

            db.where({"mpu_id":bodyParams.mpu_id}).updateInc("mpu_vote_count","mu_match_partake_user",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"比赛投票失败");
                }

                cb();
            });
        }

    ], function (err, result) {
        return RES.response(res,true);
    });

}