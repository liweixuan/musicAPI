var locationData = require("../../staticAllocation/location.json");

exports.info = function(req,res) {

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
                "u_create_time",
                "u_nickname",
                "u_realname",
                "u_header_url",
                "u_sex",
                "u_age",
                "u_money",
                "u_address",
                "u_province",
                "u_city",
                "u_district",
                "u_sign",
                "u_audio_url",
                "u_qin_age",
                "u_good_instrument",
                "u_points"
            ];

            db.field(fields).where({"u_id":restfulParams.u_id}).select("mu_users",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"用户信息获取失败");
                }

                userInfo = result[0];

                cb();

            });

        },

        //转化省市区
        function(cb){

            if(userInfo.u_province != 0){
			    userInfo.u_province_name = locationData[userInfo.u_province].name;
            }

            if(userInfo.u_city != 0){
			    userInfo.u_city_name 	 = locationData[userInfo.u_city].name;
            }

            if(userInfo.u_district != 0){
                userInfo.u_district_name = locationData[userInfo.u_district].name;
            }
			

            cb();
        },

        //计算资料完整度
        function(cb){

            var totalCount = 12;
            var infoCount  = 0;

            if(userInfo.u_nickname){
               infoCount++; 
            }

            if(userInfo.u_realname){
               infoCount++; 
            }

            if(userInfo.u_header_url){
               infoCount++; 
            }

            if(userInfo.u_address){
               infoCount++; 
            }

            if(userInfo.u_province){
               infoCount++; 
            }

            if(userInfo.u_city){
               infoCount++; 
            }

            if(userInfo.u_district){
               infoCount++; 
            }

            if(userInfo.u_sign){
               infoCount++; 
            }

            if(userInfo.u_qin_age){
               infoCount++; 
            }

            if(userInfo.u_good_instrument){
               infoCount++; 
            }

            if(userInfo.u_audio_url){
               infoCount++; 
            }

            if(userInfo.u_age){
               infoCount++; 
            }

            //百分比
            var percentage = (infoCount / totalCount);

            userInfo.percentage = percentage;

            cb();


        },

        //获取用户等级
        function(cb){

            db.where({"ul_uid":restfulParams.u_id}).order("ul_level desc").select("v_user_category_level",function(result){
                if(result == 'ERROR'){
                    return RES.response(res,false,"用户信息获取失败");
                }

                userInfo.instrumentLevels = result;

                cb();

            });
        },

        //获取当前用户的好友数
        function(cb){

            db.where({"f_username":restfulParams.u_username}).count("mu_friends",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"用户信息获取失败");
                }

                userInfo.friendCount = result;

                cb();

            });
        },

        //获取已关注的人数
        function(cb){

            db.where({"uc_uid":restfulParams.u_id}).count("mu_user_concern",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"用户信息获取失败");
                }

                userInfo.userConcernCount = result;

                cb();

            });

        },

        //获取关注自己的人
        function(cb){

            db.where({"uc_concern_id":restfulParams.u_id}).count("mu_user_concern",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"用户信息获取失败");
                }

                userInfo.concernUserCount = result;

                cb();

            });

        },

        //参与的团体
        function(cb){

            db.where({"om_username":restfulParams.u_username}).count("mu_organization_members",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"用户信息获取失败");
                }

                userInfo.organizationCount = result;

                cb();

            });

        }


    ], function (err, result) {
        return RES.response(res, true,userInfo);
    });

}