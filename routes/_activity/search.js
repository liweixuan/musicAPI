exports.search = function(req,res) {

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //查询条件
    var searchParams = {};

    //判断是否增加活动ID查询条件
    if(restful.a_id != undefined){
       searchParams.a_id = restful.a_id;
    }

    //判断是否增加省份查询条件
    if(restful.a_province != undefined){
       searchParams.a_province = restful.a_province;
    }

    //判断是否增加城市查询条件
    if(restful.a_city != undefined){
       searchParams.a_city = restful.a_city;
    }

    //判断是否增加区域查询条件
    if(restful.a_district != undefined){
       searchParams.a_district = restful.a_district;
    }

    //判断是否增加举办类型条件
    if(restful.a_hold_type != undefined){
       searchParams.a_hold_type = restful.a_hold_type;
    }

    //判断是否增加参与方式条件
    if(restful.a_participation_style != undefined){
       searchParams.a_participation_style = restful.a_participation_style;
    }

    //获取未删除的
    searchParams.a_is_delete = 0;

    //获取已审核的
    searchParams.a_is_audit = 1;

    //获取已发布的
    searchParams.a_is_release = 0;

    //获取未举办的
    searchParams.a_status = 0;

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

    var activityData = [];

    //构建任务流
    async.waterfall([

        //获取动态信息
        function(cb){

            db.field(fields).where(searchParams).limit(restful.skip,restful.limit).select("v_activity_info",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"活动信息获取失败");
                }

                activityData = result;

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true, activityData);
    });

}