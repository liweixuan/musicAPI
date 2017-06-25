exports.getPartakeMatch = function(req,res) {

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //拼接分页参数
    if(restful.limit == undefined){
        restful.limit = config.publicConfig.LIMIT;
    }

    if(restful.skip == undefined){
         restful.skip = 0;
    }

    //转化所需字段
    var fields = "";
    if(bodyParams != undefined && bodyParams.fields != undefined){

        //拼接字段显示字符串
        if(bodyParams.fields.length > 0){
            fields = bodyParams.fields.join(",");
        }
    }

    var matchData = [];

    //构建任务流
    async.waterfall([

        //获取参与的比赛
        function(cb){

            var nowTime = common.nowTime(false);

            var attachWhere = "";

            //正在进行的
            if(restful.type == 0){

                attachWhere = "m_start_time < " + nowTime + " and m_end_time > " + nowTime;

            //历史赛事    
            }else{

                attachWhere = "m_end_time < " + nowTime;

            }

            db.field(fields).where({"mpu_uid":restful.mpu_uid,"mpu_is_delete":0}).attachWhere(attachWhere).limit(restful.skip,restful.limit).select("v_user_partake_match_info",function(result){

                    if(result == 'ERROR'){
                        return RES.response(res,false,"比赛信息获取失败");
                    }

                    matchData = result;

                    //添加状态属性
                    for(var i=0;i<matchData.length;i++){

                        if(restful.type == 0){
                            matchData[i].m_status = 1;
                        }else{
                            matchData[i].m_status = 2;
                        }
                        
                    }

                    cb();

            });

        }

       
    ], function (err, result) {
        return RES.response(res, true, matchData);
    });

}