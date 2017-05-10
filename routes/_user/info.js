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
                "u_money",
                "u_is_teacher",
                "u_is_sponsors",
                "u_address",
                "u_official_teacher",
                "u_province",
                "u_city",
                "u_district",
                "u_sign",
                "u_qin_age",
                "u_good_instrument"
            ];

            db.field(fields).where({"u_id":restfulParams.u_id}).select("mu_users",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"用户信息获取失败");
                }

                userInfo = result[0];

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true,userInfo);
    });

}