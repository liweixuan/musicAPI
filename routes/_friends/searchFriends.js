exports.searchFriends = function(req,res) {

    //获取restful参数
    var restfulParams = req.routeInfo.restfulParams;

    var friendData = [];

    //构建任务流
    async.waterfall([

        //查询用户的好友列表
        function(cb){

            //附加条件
            var attachWhereStr = "";

            if(restfulParams.u_nickname != undefined){
                attachWhereStr = "u_nickname like '%"+restfulParams.u_nickname+"%'";
            }


            db.where({"f_username":restfulParams.f_username}).attachWhere(attachWhereStr).select("v_friends_info",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"好友列表获取失败");
                }

                friendData = result;

                cb();


            });
        }

    ], function (err, result) {
        return RES.response(res, true,friendData);
    });

}