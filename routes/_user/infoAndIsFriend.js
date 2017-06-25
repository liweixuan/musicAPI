var locationData = require("../../staticAllocation/location.json");

exports.infoAndIsFriend = function(req,res) {

    //获取body参数
    var restfulParams = req.routeInfo.restfulParams;

    //用户信息
    var userInfo = {};

    //构建任务流
    async.waterfall([

        //获取用户详细信息
        function(cb){

            db.where({"u_username":restfulParams.u_username}).select("mu_users",function(result){

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
            }else{
                userInfo.u_province_name = "";
            }

            if(userInfo.u_city != 0){
			    userInfo.u_city_name 	 = locationData[userInfo.u_city].name;
            }else{
                userInfo.u_city_name = "";
            }

            if(userInfo.u_district != 0){
                userInfo.u_district_name = locationData[userInfo.u_district].name;
            }else{
                userInfo.u_district_name = "";
            }

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
        
        //获取用户头衔
        function(cb){

            db.where({ur_uid:restfulParams.u_id}).select("mu_user_rank",function(result){
                
                if(result == 'ERROR'){
                    return RES.response(res,false,"用户信息获取失败");
                }

                userInfo.ranks = result;
                
                cb();
            });

        },

        //查询是否为好友关系
        function(cb){

            if(restfulParams.u_username == restfulParams.f_username){

                userInfo.isFriend = 2;

                cb();

            }else{

                db.where({"f_username":restfulParams.u_username,"f_fusername":restfulParams.f_username}).count("mu_friends",function(result){
                
                    if(result == 'ERROR'){
                        return RES.response(res,false,"好友关系查询失败");
                    }

                    //是好友关系
                    if(result > 0){
                        userInfo.isFriend = 1;
                    }else{
                        userInfo.isFriend = 0;
                    }

                    cb();

                });


            }

        }

    ], function (err, result) {
        return RES.response(res, true,userInfo);
    });

}