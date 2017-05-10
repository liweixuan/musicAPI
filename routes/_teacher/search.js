exports.search = function(req,res) {

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //查询条件
    var searchParams = {};

    //判断是否增加用户ID查询条件
    if(restful.u_teacher_instrument != undefined){
       searchParams.u_teacher_instrument = restful.u_teacher_instrument;
    }

    //判断是否为官方教师
    if(restful.u_official_teacher != undefined){
       searchParams.u_official_teacher = restful.u_official_teacher;
    }

    //判断是否增加性别查询条件
    if(restful.u_sex != undefined){
       searchParams.u_sex = restful.u_sex;
    }

    //判断是否增加省份查询条件
    if(restful.u_province != undefined){
       searchParams.u_province = restful.u_province;
    }

    //判断是否增加城市查询条件
    if(restful.u_city != undefined){
       searchParams.u_city = restful.u_city;
    }

    //判断是否增加区域查询条件
    if(restful.u_district != undefined){
       searchParams.u_district = restful.u_district;
    }

    //获取未删除的
    searchParams.u_is_delete = 0;

    //老师用户
    searchParams.u_is_teacher = 1;

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

    var dynamicData = [];

    //构建任务流
    async.waterfall([

        //获取教师信息
        function(cb){

            db.field(fields).where(searchParams).limit(restful.skip,restful.limit).select("v_user_category",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"教师信息获取失败");
                }

                dynamicData = result;

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true, dynamicData);
    });

}