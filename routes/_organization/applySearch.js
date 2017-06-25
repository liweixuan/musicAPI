exports.applySearch = function(req,res) {

    //获取restful参数
    var restfulParams = req.routeInfo.restfulParams;

    var applyOrganizationData = [];

    //构建任务流
    async.waterfall([

        // + "' or frl_sponsorUserName = '" + restfulParams.username + "'"
        function(cb){

            db.where({"oa_create_username":restfulParams.oa_create_username}).order("oa_status asc").select("mu_organization_apply",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"请求列表获取失败");
                }

                applyOrganizationData = result;

                cb();


            });
        }

    ], function (err, result) {
        return RES.response(res, true,applyOrganizationData);
    });

}