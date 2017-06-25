exports.apply = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //检测是否已是好友
        function(cb){

            db.where({f_username : bodyParams.sponsorUsername,f_fusername : bodyParams.receiveUsername}).count("mu_friends",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"添加好友请求发送失败");
                }

                if(result > 0){
                    return RES.response(res,false,"您们已经是好友了");
                }

                cb();

            });
        },

        //检测是否发送过请求了
        function(cb){

            db.where({frl_sponsorUserName : bodyParams.sponsorUsername,frl_receiveUserName : bodyParams.receiveUsername}).select("mu_friends_request_log",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"添加好友请求发送失败");
                }
                
                var requestLog = result[0];

                if(result.length > 0 && requestLog.frl_status == 0){
                    return RES.response(res,false,"您已发送过该请求，请耐心等待对方处理");
                }

                if(result.length > 0 && requestLog.frl_status == 1){
                    return RES.response(res,false,"您们已经是好友了");
                }

                cb();

            });


        },

        //添加好友请求信息
        function(cb){

            var addParams = {
                frl_sponsorUserName : bodyParams.sponsorUsername,
                frl_receiveUserName : bodyParams.receiveUsername
            };

            db.add(addParams,"mu_friends_request_log",function(result){
                if(result == 'ERROR'){
                    return RES.response(res,false,"添加好友请求发送失败");
                }

                cb();
            });
        },

        //融云发送添加好友消息
        function(cb){

            rongcloudSDK.message.private.publish(
                "ADD_FRIEND_SYSTEM_USER", 
                bodyParams.receiveUsername, 
                "RC:TxtMsg", 
                '{"content":{"operation":"ADD_FRIEND_ACTION","sourceUserId":"'+bodyParams.sponsorUsername+'","targetUserId":"'+bodyParams.receiveUsername+'","message":"","extra":""}}', 
                "", 
                "",
                "json",
                function(err,resultText){

                    console.log(err);

                    if(err){
                        return RES.response(res,false,"添加好友请求发送失败");
                    }

                    //转化为JSON对象格式
                    var result = JSON.parse(resultText);

                    //消息发送成功
                    if(result.code == '200'){
                        cb();
                    }else{
                        return RES.response(res,false,"添加好友请求发送失败");
                    }
            });
        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}