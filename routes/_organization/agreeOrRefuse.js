exports.agreeOrRefuse = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //请求数据
    var organizationRequest = {};

    //构建任务流
    async.waterfall([

        //获取请求列表信息
        function(cb){

            db.where({"oa_id":bodyParams.oa_id}).select("mu_organization_apply",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"团体请求处理失败");
                }
                
                if(result.length <= 0){
                    return RES.response(res,false,"团体请求处理失败");
                }

                organizationRequest = result[0];

                cb();


            });
        },

        //根据类型处理
        function(cb){

            //拒绝
            if(bodyParams.type == 0){

                var updateParams = {
                    oa_status : 2
                };

                db.where({"oa_id":bodyParams.oa_id}).update(updateParams,"mu_organization_apply",function(result){

                    if(result == 'ERROR'){
                        return RES.response(res,false,"团体请求处理失败");
                    }

                    //发送拒绝请求消息
                    rongcloudSDK.message.private.publish(
                        "JOIN_ORGANIZATION_SYSTEM_USER", 
                        organizationRequest.oa_apply_username, 
                        "RC:TxtMsg", 
                        '{"content":{"operation":"REFUSE_ORGANIZATION_ACTION","sourceUserId":"'+organizationRequest.oa_create_username+'","targetUserId":"'+organizationRequest.oa_apply_username+'","message":"","extra":""}}', 
                        "", 
                        "",
                        "json",
                        function(err,resultText){

                            if(err){
                                return RES.response(res,false,"团体请求处理失败");
                            }

                            //转化为JSON对象格式
                            var result = JSON.parse(resultText);

                            //消息发送成功
                            if(result.code == '200'){
                                return RES.response(res,true);
                            }else{
                                return RES.response(res,false,"团体请求处理失败");
                            }
                    });

                });

            //同意    
            }else{
                
                var updateParams = {
                    oa_status : 1
                };


                db.where({"oa_id":bodyParams.oa_id}).update(updateParams,"mu_organization_apply",function(result){

                    if(result == 'ERROR'){
                        return RES.response(res,false,"团体请求处理失败");
                    }

                    //发送拒绝请求消息
                    rongcloudSDK.message.private.publish(
                        "JOIN_ORGANIZATION_SYSTEM_USER", 
                        organizationRequest.oa_apply_username, 
                        "RC:TxtMsg", 
                        '{"content":{"operation":"AGREE_ORGANIZATION_ACTION","sourceUserId":"'+organizationRequest.oa_create_username+'","targetUserId":"'+organizationRequest.oa_apply_username+'","message":"","extra":""}}', 
                        "", 
                        "",
                        "json",
                        function(err,resultText){

                            if(err){
                                return RES.response(res,false,"团体请求处理失败");
                            }

                            //转化为JSON对象格式
                            var result = JSON.parse(resultText);

                            //消息发送成功
                            if(result.code == '200'){
                                cb();
                            }else{
                                return RES.response(res,false,"团体请求处理失败");
                            }
                    });

                });
            }

        },

        //将用户加入团体
        function(cb){

            var addParams = {
                om_oid            : organizationRequest.oa_oid,
                om_username       : organizationRequest.oa_apply_username,
                om_is_create_user : 0,
                om_create_time    : common.nowTime(false) 
            };

            db.add(addParams,"mu_organization_members",function(result){
                if(result == 'ERROR'){
                    return RES.response(res,false,"团体请求处理失败");
                }

                cb();
            })


        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}