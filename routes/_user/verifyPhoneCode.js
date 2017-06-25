exports.verifyPhoneCode = function(req,res) {

    //获取restful参数
    var bodyParams = req.routeInfo.bodyParams;

    //验证码数据
    var codeData = {};

    //过期时间
    var expireTime = 60 * 10;

    //构建任务流
    async.waterfall([

        //获取已有验证码数据
        function(cb){

            db.where({"s_iphone":bodyParams.phone}).select("mu_sms",function(result){
                if(result == 'ERROR'){
                    return RES.response(res,false,"无效的验证码");
                }

                if(result.length <= 0){
                    return RES.response(res,false,"无效的验证码");
                }

                codeData = result[0];

                cb();

            });

        },

        //判断验证码是否过期
        function(cb){

            var sendTime = codeData.s_send_time;

            var nowtime  = common.nowTime(false);

            if((sendTime + expireTime) > nowtime){
                cb();
            }else{
                return RES.response(res,false,"验证码已失效");
            }
        },

        //判断验证码是否正确
        function(cb){

            if(codeData.s_code == bodyParams.code){
                cb();
            }else{
                return RES.response(res,false,"验证码错误");
            }

        }
        
    ], function (err, result) {
        return RES.response(res, true);
    });

}