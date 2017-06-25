exports.organizationSearch = function(req,res) {

    //获取restful参数
    var restfulParams = req.routeInfo.restfulParams;

    var organizationData = [];

    //构建任务流
    async.waterfall([

        //查询团体列表
        function(cb){

           var fields = [
                "o_id",
                "o_name",
                "o_logo",
                "o_user_count",
                "om_is_create_user"
            ].join(",");

            db.field(fields).where({"om_username":restfulParams.u_username,o_is_delete:0}).select("v_user_organization",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"团体列表获取失败");
                }

                organizationData = result;

                cb();


            });
        }

    ], function (err, result) {
        return RES.response(res, true,organizationData);
    });

}