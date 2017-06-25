var locationData = require("../../staticAllocation/location.json");

exports.createUserOrganization = function(req,res) {

    //获取restful参数
	var restful = req.routeInfo.restfulParams;

    var organizationData = [];

    //构建任务流
    async.waterfall([

        //获取个人演奏集信息
        function(cb){

            db.order("o_id desc").where({"o_create_userid":restful.o_create_userid,o_is_delete:0}).select("mu_organization",function(result){

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