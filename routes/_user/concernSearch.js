exports.concernSearch = function(req,res) {

    //获取restful参数
    var restfulParams = req.routeInfo.restfulParams;

    var concernData = [];

    //构建任务流
    async.waterfall([

        //查询用户的好友列表
        function(cb){

            db.where({"uc_uid":restfulParams.u_id,u_is_delete:0}).select("v_concern_user",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"关注列表获取失败");
                }

                concernData = result;

                cb();


            });
        }

    ], function (err, result) {
        return RES.response(res, true,concernData);
    });

}