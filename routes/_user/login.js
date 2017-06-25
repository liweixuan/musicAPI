exports.login = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //帐号
    var username = bodyParams.u_username;

    //密码
    var password = common.md5(bodyParams.u_password);

    //用户信息
    var userInfo = {};

    //最终结果
    var resultData = {};

    //构建任务流
    async.waterfall([

        //查询该用户信息
        function(cb){

            db.where({ u_username : username }).select("mu_users",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"登录失败，请重新尝试");
                }

                if(result.length <= 0){
                    return RES.response(res,false,"对不起，该用户不存在");
                }

                userInfo = result[0];
                
                cb();

            });

        },

        //验证
        function(cb){

            //验证是否被禁用
            if(userInfo.u_is_delete == 1){
                return RES.response(res,false,"对不起，该用户已被禁用，请联系管理人员");
            }

            //验证密码
            if(userInfo.u_password != password){
                return RES.response(res,false,"对不起，密码错误");
            }

            cb();

        },

        //数据返回
        function(cb){

            var rsParams = {
                u_username        : userInfo.u_username,
                u_header_url      : userInfo.u_header_url,
                u_sex             : userInfo.u_sex,
                u_nickname        : userInfo.u_nickname,
                u_good_instrument : userInfo.u_good_instrument,
                u_id              : userInfo.u_id,
                u_age             : userInfo.u_age,
                u_sign            : userInfo.u_sign,
            };

            resultData = rsParams;

            cb();

        }

    ], function (err, result) {
        return RES.response(res, true,resultData);
    });

}