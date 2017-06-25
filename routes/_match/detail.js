exports.detail = function(req,res) {

    //获取restful参数
    var restfulParams = req.routeInfo.restfulParams;

    //当前时间戳
    var nowtime = common.nowTime(false);

    var mtachDetail = {};

    //构建任务流
    async.waterfall([

        //查询比赛详细信息
        function(cb){

            db.where({"m_id":restfulParams.match_id}).select("v_match_music_score",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"比赛详细信息获取失败");
                }

                mtachDetail = result[0];

                //比赛状态计算
                var matchStatus = 0;
                if(mtachDetail.m_start_time > nowtime){
                    matchStatus = 0;
                }else if(mtachDetail.m_start_time < nowtime && mtachDetail.m_end_time > nowtime){
                    matchStatus = 1;
                }else if(mtachDetail.m_end_time < nowtime){
                    matchStatus = 2;
                }

                mtachDetail.status = matchStatus;
                
                cb();


            });
        },

        //获取比赛奖品信息
        function(cb){

            db.where({"mp_mid":restfulParams.match_id}).select("v_match_prize_user",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"比赛详细信息获取失败");
                }

                mtachDetail.prize = result[0];

                cb();

            });


        },

        //获取参赛人员列表
        function(cb){

            
            db.where({"mpu_mid":restfulParams.match_id,"mpu_is_delete":0}).order("mpu_vote_count desc").select("v_match_partake_user_info",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"比赛详细信息获取失败");
                }

                mtachDetail.partakeUser = result;

                cb();

            });
        },

        //计算总投票数
        function(cb){

            var voteCount = 0;

            for(var i =0 ;i<mtachDetail.partakeUser.length;i++){

                voteCount+= mtachDetail.partakeUser[i].mpu_vote_count;

            }

            mtachDetail.totalVoteCount = voteCount;

            cb(); 

        }

    ], function (err, result) {
        return RES.response(res, true,mtachDetail);
    });

}