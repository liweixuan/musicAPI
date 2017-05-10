var locationData = require("../../staticAllocation/location.json");

exports.info = function(req,res) {

    //获取restful参数
    var restfulParams = req.routeInfo.restfulParams;

    //团体信息
    var organizationInfo = {};

    //构建任务流
    async.waterfall([

        //获取团体基本信息
        function(cb){

            db.where({"o_id":restfulParams.o_id}).select("mu_organization",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"团体详情获取失败");
                }

                organizationInfo.detail = result[0];
                organizationInfo.detail.o_province_name = locationData[organizationInfo.detail.o_province].name;
				organizationInfo.detail.o_city_name 	= locationData[organizationInfo.detail.o_city].name;
				organizationInfo.detail.o_district_name = locationData[organizationInfo.detail.o_district].name;

                cb();

            });

        },

        //获取相册信息
        function(cb){

            db.where({
                "op_oid":restfulParams.o_id,
                "op_fid":0,
                "op_is_delete":0
            }).select("mu_organization_photo",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"团体详情获取失败");
                }

                organizationInfo.photo = result;

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true,organizationInfo);
    });

}