exports.cancelOrganizationConcern = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    
    //构建任务流
    async.waterfall([

        //取消关注某用户
        function(cb){

            db.where(bodyParams).del("mu_organization_concern",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"取消关注失败");
                }
                
                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}