exports.agreeOrRefuse = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //请求数据
    var friendsRequest = {};

    //构建任务流
    async.waterfall([

        //获取请求列表信息
        function(cb){

            db.where({"frl_id":bodyParams.frl_id}).select("mu_friends_request_log",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"好友请求处理失败");
                }
                
                if(result.length <= 0){
                    return RES.response(res,false,"好友请求处理失败");
                }

                friendsRequest = result[0];

                cb();


            });
        },

        //根据类型处理
        function(cb){

            //拒绝
            if(bodyParams.type == 0){

                var updateParams = {
                    frl_status : 2
                };

                db.where({"frl_id":bodyParams.frl_id}).update(updateParams,"mu_friends_request_log",function(result){

                    if(result == 'ERROR'){
                        return RES.response(res,false,"好友请求处理失败");
                    }

                    //发送拒绝请求消息
                    rongcloudSDK.message.private.publish(
                        "ADD_FRIEND_SYSTEM_USER", 
                        friendsRequest.frl_sponsorUserName, 
                        "RC:TxtMsg", 
                        '{"content":{"operation":"REFUSE_FRIEND_ACTION","sourceUserId":"'+friendsRequest.frl_receiveUserName+'","targetUserId":"'+friendsRequest.frl_sponsorUserName+'","message":"","extra":""}}', 
                        "", 
                        "",
                        "json",
                        function(err,resultText){

                            if(err){
                                return RES.response(res,false,"好友请求处理失败");
                            }

                            //转化为JSON对象格式
                            var result = JSON.parse(resultText);

                            //消息发送成功
                            if(result.code == '200'){
                                return RES.response(res,true);
                            }else{
                                return RES.response(res,false,"好友请求处理失败");
                            }
                    });

                });

            //同意    
            }else{
                
                var updateParams = {
                    frl_status : 1
                };


                db.where({"frl_id":bodyParams.frl_id}).update(updateParams,"mu_friends_request_log",function(result){

                    if(result == 'ERROR'){
                        return RES.response(res,false,"好友请求处理失败");
                    }

                    //发送拒绝请求消息
                    rongcloudSDK.message.private.publish(
                        "ADD_FRIEND_SYSTEM_USER", 
                        friendsRequest.frl_sponsorUserName, 
                        "RC:TxtMsg", 
                        '{"content":{"operation":"AGREE_FRIEND_ACTION","sourceUserId":"'+friendsRequest.frl_receiveUserName+'","targetUserId":"'+friendsRequest.frl_sponsorUserName+'","message":"","extra":""}}', 
                        "", 
                        "",
                        "json",
                        function(err,resultText){

                            if(err){
                                return RES.response(res,false,"好友请求处理失败");
                            }

                            //转化为JSON对象格式
                            var result = JSON.parse(resultText);

                            //消息发送成功
                            if(result.code == '200'){
                                cb();
                            }else{
                                return RES.response(res,false,"好友请求处理失败");
                            }
                    });

                });
            }

        },

        //互加好友
        function(cb){

            var addParams = {
                f_username    : friendsRequest.frl_sponsorUserName,
                f_fusername   : friendsRequest.frl_receiveUserName,
                f_create_time : common.nowTime(false) 
            };

            db.add(addParams,"mu_friends",function(result){
                if(result == 'ERROR'){
                    return RES.response(res,false,"好友请求处理失败");
                }

                cb();
            })


        },

        function(cb){

            var addParams = {
                f_username    : friendsRequest.frl_receiveUserName,
                f_fusername   : friendsRequest.frl_sponsorUserName,
                f_create_time : common.nowTime(false) 
            };

            db.add(addParams,"mu_friends",function(result){
                if(result == 'ERROR'){
                    return RES.response(res,false,"好友请求处理失败");
                }

                cb();
            })

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}