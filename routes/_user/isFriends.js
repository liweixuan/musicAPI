exports.isFriends = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //是否为好友
    var isFriendResult = {};

    //构建任务流
    async.waterfall([
        
        //查询是否为好友关系
        function(cb){

            db.where({"f_username":bodyParams.u_username,"f_fusername":bodyParams.f_username}).count("mu_friends",function(result){
                
                if(result == 'ERROR'){
                    return RES.response(res,false,"好友关系查询失败");
                }

                //是好友关系
                if(result > 0){
                    isFriendResult.isFriend = 1;
                }else{
                    isFriendResult.isFriend = 0;
                }

                cb();
            });
            
        }

    ], function (err, result) {
        return RES.response(res, true,isFriendResult);
    });

}

