exports.register = function(req,res) {

    //获取restful参数
    var bodyParams = req.routeInfo.bodyParams;

    //最终返回结果
    var resultData = {};

    //构建任务流
    async.waterfall([

        //判断该手机号码是否已注册过
        function(cb){

            db.where({"u_username":bodyParams.u_username}).count("mu_users",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"用户注册失败");
                }

                if(result > 0){
                    return RES.response(res,false,"该用户已被注册");
                }

                cb();

            });

        },

        //注册
        function(cb){

            var addParams = {
                u_username        : bodyParams.u_username,
                u_header_url      : bodyParams.u_header_url,
                u_sex             : bodyParams.u_sex,
                u_password        : common.md5(bodyParams.u_password),
                u_nickname        : bodyParams.u_nickname,
                u_good_instrument : bodyParams.u_good_instrument,
                u_create_time     : common.nowTime(false),
            };

            db.add(addParams,"mu_users",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"用户注册失败");
                }


                //拼接需要返回的数据信息
                var rsParams = {
                    u_username        : bodyParams.u_username,
                    u_header_url      : bodyParams.u_header_url,
                    u_sex             : bodyParams.u_sex,
                    u_nickname        : bodyParams.u_nickname,
                    u_good_instrument : bodyParams.u_good_instrument,
                    u_id              : result
                };

                resultData = rsParams;

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true,resultData);
    });

}