exports.applySearch = function(req,res) {

    //获取restful参数
    var restfulParams = req.routeInfo.restfulParams;

    var applyFriendData = [];

    //构建任务流
    async.waterfall([

        // + "' or frl_sponsorUserName = '" + restfulParams.username + "'"
        function(cb){

            db.attachWhere("frl_receiveUserName = '" + restfulParams.username + "'").order("frl_status asc").select("mu_friends_request_log",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"请求列表获取失败");
                }

                applyFriendData = result;

                cb();


            });
        }

    ], function (err, result) {
        return RES.response(res, true,applyFriendData);
    });

}