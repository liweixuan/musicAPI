exports.add = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //创建成功后的群组ID
    var groupId = 0;

    //构建任务流
    async.waterfall([

        //在APP服务器创建团体
        function(cb){

            var addParams = {
                o_name 		    	: bodyParams.o_name,
                o_logo 				: bodyParams.o_logo,
                o_cover				: bodyParams.o_cover,
                o_province 			: bodyParams.o_province,
                o_city 				: bodyParams.o_city,
                o_district 			: bodyParams.o_district,
                o_type 				: bodyParams.o_type,
                o_motto 		    : bodyParams.o_motto,
                o_desc 				: bodyParams.o_desc,
                o_ask 				: bodyParams.o_ask,
                o_create_userid 	: bodyParams.o_create_userid,
                o_create_time 	    : common.nowTime(false),
                o_video_url         : bodyParams.o_video_url == undefined ? "" : bodyParams.o_video_url,
                o_video_image       : bodyParams.o_video_image == undefined ? "" : bodyParams.o_video_image,
                o_address           : bodyParams.o_address   == undefined ? "" : bodyParams.o_address
            };

            db.add(addParams,"mu_organization",function(result){
                if(result == 'ERROR'){
                    return RES.response(res,false,"团体创建失败，请重新尝试");
                }

               groupId = result;
               
               cb();

            });

            
        },

        //在融云服务器创建团体
        function(cb){

            rongcloudSDK.group.create([bodyParams.o_create_username,"SYSTEM_GROUP_USER"],"GROUP_" + groupId,bodyParams.o_name,function(err,resultText){
                console.log(err);

                if(err){
                    return RES.response(res,false,"团体创建失败，请重新尝试");
                }
                
                //转化为JSON对象格式
                var result = JSON.parse(resultText);

                //消息发送成功
                if(result.code == '200'){
                    cb();
                }else{
                    return RES.response(res,false,"团体创建失败，请重新尝试");
                }

            });

        },

        //将创建人加入团体
        function(cb){

            var addParams = {
                om_oid            : groupId,
                om_username       : bodyParams.o_create_username,
                om_is_create_user : 1,
                om_create_time    : common.nowTime(false) 
            };

            db.add(addParams,"mu_organization_members",function(result){
                if(result == 'ERROR'){
                    return RES.response(res,false,"团体创建失败，请重新尝试");
                }

                cb();
            })

        },

        //发送群组创建成功信息
        function(cb){

            rongcloudSDK.message.group.publish(
                "SYSTEM_GROUP_USER", 
                "GROUP_" + groupId,
                "RC:InfoNtf", 
                '{"message":"团体已创建成功","extra":"'+bodyParams.o_create_username+'"}', 
                "", 
                "",
                "json",
                function(err,resultText){

                    console.log(err);

                    if(err){
                        return RES.response(res,false,"团体已创建成功，创建通知发送失败");
                    }

                    //转化为JSON对象格式
                    var result = JSON.parse(resultText);

                    //消息发送成功
                    if(result.code == '200'){
                        cb();
                    }else{
                        return RES.response(res,false,"团体已创建成功，创建通知发送失败");
                    }
            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}