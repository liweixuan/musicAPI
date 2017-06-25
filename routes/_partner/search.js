var locationData = require("../../staticAllocation/location.json");

exports.search = function(req,res) {

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //查询条件
    var searchParams = {};

    //判断是否增加用户性别查询条件
    if(restful.u_sex != undefined){
       searchParams.u_sex = restful.u_sex;
    }

    //判断是否增加省份查询条件
    if(restful.fp_province != undefined){
       searchParams.fp_province = restful.fp_province;
    }

    //判断是否增加城市查询条件
    if(restful.fp_city != undefined){
       searchParams.fp_city = restful.fp_city;
    }

    //判断是否增加区域查询条件
    if(restful.fp_district != undefined){
       searchParams.fp_district = restful.fp_district;
    }

    //获取未删除的
    searchParams.fp_is_delete = 0;

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

    var findPartnerData = [];

    //构建任务流
    async.waterfall([

        //获取动态信息
        function(cb){

            db.field(fields).where(searchParams).order("fp_id desc").limit(restful.skip,restful.limit).select("v_find_partner_user",function(result){

                console.log(result);
                if(result == 'ERROR'){
                    return RES.response(res,false,"找伙伴信息获取失败");
                }

                findPartnerData = result;

                cb();

            });

        },

        //添加省市区地址名称
		function(cb){

			for(var i = 0;i<findPartnerData.length;i++){

                if(findPartnerData[i].fp_province){
                    findPartnerData[i].fp_province_name = locationData[findPartnerData[i].fp_province].name;
                }

                if(findPartnerData[i].fp_city){
                    findPartnerData[i].fp_city_name 	= locationData[findPartnerData[i].fp_city].name;
                }

                if(findPartnerData[i].fp_district){
                    findPartnerData[i].fp_district_name = locationData[findPartnerData[i].fp_district].name;
                }

			}

			cb();

		}

    ], function (err, result) {
        return RES.response(res, true, findPartnerData);
    });

}