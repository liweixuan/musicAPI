exports.radioSearch = function(req,res) {

    //获取restful参数
    var restfulParams = req.routeInfo.restfulParams;

    //最终用户数据
    var userData = [];

    //分页参数
    var limitParams = {};

    //拼接分页参数
    if(restfulParams.limit == undefined){
        limitParams.limit = config.publicConfig.LIMIT;
    }else{
        limitParams.limit = restfulParams.limit;
    }
    delete restfulParams.limit;


    if(restfulParams.skip == undefined){
         limitParams.skip = 0;
    }else{
        limitParams.skip = restfulParams.skip;
    }
    delete restfulParams.skip;

    //所有正常使用用户
    restfulParams.u_is_delete = 0;

    //构建任务流
    async.waterfall([

        function(cb){

            var fields = [
                "u_id",
                "u_username",
                "u_nickname",
                "u_realname",
                "u_header_url",
                "u_sex",
                "u_audio_url"
            ].join(",");

            db.field(fields).where(restfulParams).attachWhere("u_audio_url!='0'").limit(limitParams.skip,limitParams.limit).select("mu_users",function(result){
                console.log(result);
                if(result == 'ERROR'){
                    return RES.response(res,false,"用户信息获取失败");
                }

                userData = result;

                cb();
                
            });
 
        }

    ], function (err, result) {
        return RES.response(res, true,userData);
    });

}