exports.updateUserLocation = function(req,res) {

    var UserLocation = mongoose.model("UserLocation");

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //操作方式 2-更新 1-写入
    var actionModel = 1;

    //构建任务流
    async.waterfall([

        //查询是否存在该用户
        function(cb){

            UserLocation.count({userid:bodyParams.userid},function(err,count){

				if(err){
					return RES.response(res,false,"用户位置信息保存失败");
				}

                if(count <= 0){
                    actionModel = 1;
                }else{
                    actionModel = 2;
                }

                cb();

			});
        },

        //进行相关操作
        function(cb){

            if(actionModel == 1){

                var userLocationModel = new UserLocation({
                    userid             : bodyParams.userid,
                    username           : bodyParams.username,
                    nickname           : bodyParams.nickname,
                    headerUrl          : bodyParams.headerUrl,
                    sex                : bodyParams.sex,
                    age                : bodyParams.age,
                    sign               : bodyParams.sign,
                    userGoodInstrument : bodyParams.userGoodInstrument,
                    location           : [bodyParams.longitude,bodyParams.latitude]
			    });

                userLocationModel.save(function(err){

				    if(err){
                        return RES.response(res,false,"用户位置信息保存失败");
				    }

				    cb();

			    });


            }else{

                UserLocation.update(
                    {userid:bodyParams.userid},
                    {$set:{
                        nickname           : bodyParams.nickname,
                        headerUrl          : bodyParams.headerUrl, 
                        sex                : bodyParams.sex,
                        userGoodInstrument : bodyParams.userGoodInstrument,
                         location          : [bodyParams.longitude,bodyParams.latitude]
                        }
                    },
                    function(err,docs){

                    if(err){
                        return Res.Return(false,"用户位置信息保存失败",req,res);
                    }

                    cb();

				});
            }
        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}