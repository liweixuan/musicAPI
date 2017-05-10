var locationData = require("../../staticAllocation/location.json");

exports.search = function(req,res) {

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //查询条件
    var searchParams = {};

    //判断是否增加团体ID查询条件
    if(restful.o_id != undefined){
       searchParams.o_id = restful.o_id;
    }

    //判断是否增加省份查询条件
    if(restful.o_province != undefined){
       searchParams.o_province = restful.o_province;
    }

    //判断是否增加城市查询条件
    if(restful.o_city != undefined){
       searchParams.o_city = restful.o_city;
    }

    //判断是否增加区域查询条件
    if(restful.o_district != undefined){
       searchParams.o_district = restful.o_district;
    }

    //获取未删除的
    searchParams.o_is_delete = 0;

    //审核通过的
    searchParams.o_is_audit = 1;

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

    var organizationData = [];

    //构建任务流
    async.waterfall([

        //获取动态信息
        function(cb){

            db.field(fields).where(searchParams).limit(restful.skip,restful.limit).select("mu_organization",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"团体信息获取失败");
                }

                organizationData = result;

                cb();

            });

        },

        //添加省市区地址名称
		function(cb){

			for(var i = 0;i<organizationData.length;i++){
				organizationData[i].o_province_name = locationData[organizationData[i].o_province].name;
				organizationData[i].o_city_name 	= locationData[organizationData[i].o_city].name;
				organizationData[i].o_district_name = locationData[organizationData[i].o_district].name;
			}

			cb();

		}

    ], function (err, result) {
        return RES.response(res, true, organizationData);
    });

}