var locationData = require("../../staticAllocation/location.json");

exports.search = function(req,res) {

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //当前时间戳
    var nowtime = common.nowTime(false);

    //查询条件
    var searchParams = {};

    //判断是否增加乐器类型查询条件
    if(restful.m_cid != undefined){
       searchParams.m_cid = restful.m_cid;
    }

    //增加条件
    var attachWhereStr = "";
    if(restful.m_status != undefined){

        

        //未开始
        if(restful.m_status == 0){
            
            attachWhereStr = "m_start_time > " + nowtime;

        //进行中    
        }else if(restful.m_status == 1){
            
            attachWhereStr = "m_start_time < " + nowtime + " and m_end_time > " + nowtime ;

        //已结束    
        }else{ 
            attachWhereStr = "m_end_time < " + nowtime;
        }

    }

    //获取未删除的
    searchParams.m_is_delete = 0;

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

        //获取动态信息
        function(cb){

            db.field(fields).where(searchParams).attachWhere(attachWhereStr).limit(restful.skip,restful.limit).select("v_match_category",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"比赛信息获取失败");
                }

                matchData = result;

                cb();

            });

        },

        //获取当前比赛状态
        function(cb){

            for(var i=0;i<matchData.length;i++){

                var match_status = 0;

                //未开始
                if(matchData[i].m_start_time > nowtime){
                    match_status = 0;
                //进行中
                }else if(matchData[i].m_start_time < nowtime && matchData[i].m_end_time > nowtime){
                    match_status = 1;
                //已结束
                }else{
                    match_status = 2;
                }

                matchData[i].m_status = match_status;
            }

            cb();

        }

    ], function (err, result) {
        return RES.response(res, true, matchData);
    });

}