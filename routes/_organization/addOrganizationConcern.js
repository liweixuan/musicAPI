exports.addOrganizationConcern = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    
    //构建任务流
    async.waterfall([

        //判断是否已经关注过该团体
        function(cb){

            db.where(bodyParams).select("mu_organization_concern",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"关注添加失败");
                }

                if(result.length>0){
                    return RES.response(res,false,"您已关注过该团体了");
                }
                
                cb();

            });

        },

        //添加关注
        function(cb){

            var addParams = {
                oc_uid         : bodyParams.oc_uid,
                oc_concern_oid  : bodyParams.oc_concern_oid,
                oc_create_time : common.nowTime(false),
            }

            db.add(addParams,"mu_organization_concern",function(result){
                if(result == 'ERROR'){
                    return RES.response(res,false,"关注添加失败");
                }

                cb();
            });


        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}