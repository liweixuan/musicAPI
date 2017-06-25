exports.members = function(req,res) {

    //获取restful参数
    var restfulParams = req.routeInfo.restfulParams;

    //团体信息
    var organizationMembers = [];

    //构建任务流
    async.waterfall([

        //获取团体下的成员列表
        function(cb){

            db.where({"om_oid":restfulParams.o_id}).order("om_is_create_user desc").select("v_organization_user",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"团体详情获取失败");
                }

                organizationMembers = result;

                cb();

            });

        },

       
    ], function (err, result) {
        return RES.response(res, true,organizationMembers);
    });

}