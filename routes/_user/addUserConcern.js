exports.addUserConcern = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    
    //构建任务流
    async.waterfall([

        //判断是否已经关注过该用户
        function(cb){

            //判断是否在关注自己
            if(bodyParams.uc_uid == bodyParams.uc_concern_id){

                return RES.response(res,false,"抱歉，您不能关注您自己");

            }

            db.where(bodyParams).select("mu_user_concern",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"关注添加失败");
                }

                if(result.length>0){
                    return RES.response(res,false,"您已关注过该用户了");
                }
                
                cb();

            });

        },

        //添加关注
        function(cb){

            var addParams = {
                uc_uid         : bodyParams.uc_uid,
                uc_concern_id  : bodyParams.uc_concern_id,
                uc_create_time : common.nowTime(false),
            }

            db.add(addParams,"mu_user_concern",function(result){
                if(result == 'ERROR'){
                    return RES.response(res,false,"关注添加失败");
                }

                cb();
            });


        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}