exports.basicInfo = function(req,res) {

    //获取body参数
    var restfulParams = req.routeInfo.restfulParams;

    //用户信息
    var userInfo = {};

    //构建任务流
    async.waterfall([

        //获取用户详细信息
        function(cb){

            //字段筛选
            var fields = [
                "u_id",
                "u_username",
                "u_nickname",
                "u_header_url"
            ];

            db.field(fields).where({"u_username":restfulParams.u_username}).select("mu_users",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"用户信息获取失败");
                }

                userInfo = result[0];

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true,userInfo);
    });

}