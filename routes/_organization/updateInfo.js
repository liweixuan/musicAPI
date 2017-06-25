exports.updateInfo = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //获取需要修改参数
    var updateParams = {};

    //信息修改
    if(bodyParams.o_name != undefined){
       updateParams.o_name = bodyParams.o_name;
    }

    if(bodyParams.o_logo != undefined){
       updateParams.o_logo = bodyParams.o_logo;
    }

    if(bodyParams.o_cover != undefined){
       updateParams.o_cover = bodyParams.o_cover;
    }

    if(bodyParams.o_province != undefined){
       updateParams.o_province = bodyParams.o_province;
    }

    if(bodyParams.o_city != undefined){
       updateParams.o_city = bodyParams.o_city;
    }

    if(bodyParams.o_district != undefined){
       updateParams.o_district = bodyParams.o_district;
    }

    if(bodyParams.o_address != undefined){
       updateParams.o_address = bodyParams.o_address;
    }

    if(bodyParams.o_type != undefined){
       updateParams.o_type = bodyParams.o_type;
    }

    if(bodyParams.o_motto != undefined){
       updateParams.o_motto = bodyParams.o_motto;
    }

    if(bodyParams.o_desc != undefined){
       updateParams.o_desc = bodyParams.o_desc;
    }

    if(bodyParams.o_ask != undefined){
       updateParams.o_ask = bodyParams.o_ask;
    }

    if(bodyParams.o_video_url != undefined){
       updateParams.o_video_url = bodyParams.o_video_url;
    }

    //构建任务流
    async.waterfall([

        //修改用户信息
        function(cb){

            db.where({"o_id":bodyParams.o_id}).update(updateParams,"mu_organization",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"团体信息修改失败");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}