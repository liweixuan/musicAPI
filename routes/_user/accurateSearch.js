exports.accurateSearch = function(req,res) {

    //获取restful参数
    var restfulParams = req.routeInfo.restfulParams;

    //最终用户数据
    var userData = [];

    //分页参数
    var limitParams = {};

    //拼接分页参数
    if(restfulParams.limit == undefined){
        limitParams.limit = config.publicConfig.LIMIT;
        delete restfulParams.limit;
    }else{
        limitParams.limit = restfulParams.limit;
        delete restfulParams.limit;
    }

    if(restfulParams.skip == undefined){
         limitParams.skip = 0;
         delete restfulParams.skip;
    }else{
        limitParams.skip = restfulParams.skip;
        delete restfulParams.skip;
    }

    //所有正常使用用户
    restfulParams.u_is_delete = 0;

    //构建任务流
    async.waterfall([

        //判断是否有级别条件
        function(cb){

            //是否有级别查找条件
            if(restfulParams.ul_cid != undefined){

                var fields = [
                    "u_id",
                    "u_username",
                    "u_nickname",
                    "u_realname",
                    "u_header_url",
                    "u_sign",
                    "u_age",
                    "u_sex",
                    "u_good_instrument",
                    "ul_cid",
                    "ul_level"
                ].join(",");

            
                    db.field(fields).where(restfulParams).limit(limitParams.skip,limitParams.limit).select("v_user_level",function(result){
                        console.log(result);
                        if(result == 'ERROR'){
                            return RES.response(res,false,"用户筛选信息获取失败");
                        }

                        userData = result;

                        cb();
                        
                    });


            }else{

                var fields = [
                    "u_id",
                    "u_username",
                    "u_nickname",
                    "u_realname",
                    "u_sign",
                    "u_age",
                    "u_header_url",
                    "u_sex",
                    "u_good_instrument"
                ].join(",");

                db.field(fields).where(restfulParams).limit(limitParams.skip,limitParams.limit).select("mu_users",function(result){

                    if(result == 'ERROR'){
                        return RES.response(res,false,"用户筛选信息获取失败");
                    }

                    userData = result;

                    cb();
                        
                });

            }

        }

    ], function (err, result) {
        return RES.response(res, true,userData);
    });

}