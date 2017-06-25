exports.applyAddOrganization = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //检测是否已经加入了该团体
        function(cb){

            db.where({"oa_apply_username":bodyParams.u_username,"oa_oid":bodyParams.o_id}).order("oa_status asc").select("mu_organization_apply",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"申请加入团体失败");
                }

                if(result.length > 0 && result[0].oa_status == 1){
                    return RES.response(res,false,"您已经加入该团体了");
                }

                if(result.length > 0 && result[0].oa_status == 0){
                    return RES.response(res,false,"您已申请加入过该团体了，请耐心等待审核");
                }

                cb();

            });
            
        },

        //添加团队请求信息
        function(cb){

            var addParams = {
                oa_apply_username   : bodyParams.u_username,
                oa_create_username  : bodyParams.o_create_username,
                oa_oid              : bodyParams.o_id,
                oa_note             : bodyParams.note == undefined ? "" : bodyParams.note, 
                oa_create_time      : common.nowTime(false)
            };


            db.add(addParams,"mu_organization_apply",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"申请加入团体失败");
                }

                cb();


            });

        },

        //发送申请加入团体信息
        function(cb){

            rongcloudSDK.message.private.publish(
                "JOIN_ORGANIZATION_SYSTEM_USER", 
                bodyParams.o_create_username,          //发送消息给团体创建人
                "RC:TxtMsg", 
                '{"content":{"operation":"JOIN_ORGANIZATION_ACTION","sourceUserId":"'+bodyParams.u_username+'","targetUserId":"'+bodyParams.o_create_username+'","message":"","extra":"'+bodyParams.o_name+'"}}', 
                "", 
                "",
                "json",
                function(err,resultText){

                    console.log(err);

                    if(err){
                        return RES.response(res,false,"申请加入团体请求发送失败");
                    }

                    //转化为JSON对象格式
                    var result = JSON.parse(resultText);

                    //消息发送成功
                    if(result.code == '200'){
                        cb();
                    }else{
                        return RES.response(res,false,"申请加入团体请求发送失败");
                    }
            });
        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}