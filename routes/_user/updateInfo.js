exports.updateInfo = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //获取需要修改参数
    var updateParams = {};

    //信息修改
    if(bodyParams.u_nickname != undefined){
       updateParams.u_nickname = bodyParams.u_nickname;
    }

    if(bodyParams.u_realname != undefined){
       updateParams.u_realname = bodyParams.u_realname;
    }

    if(bodyParams.u_header_url != undefined){
       updateParams.u_header_url = bodyParams.u_header_url;
    }

    if(bodyParams.u_sex != undefined){
       updateParams.u_sex = bodyParams.u_sex;
    }

    if(bodyParams.u_money != undefined){
       updateParams.u_money = bodyParams.u_money;
    }

    if(bodyParams.u_is_teacher != undefined){
       updateParams.u_is_teacher = bodyParams.u_is_teacher;
    }

    if(bodyParams.u_is_sponsors != undefined){
       updateParams.u_is_sponsors = bodyParams.u_is_sponsors;
    }

    if(bodyParams.u_address != undefined){
       updateParams.u_address = bodyParams.u_address;
    }

    if(bodyParams.u_official_teacher != undefined){
       updateParams.u_official_teacher = bodyParams.u_official_teacher;
    }

    if(bodyParams.u_province != undefined){
       updateParams.u_province = bodyParams.u_province;
    }

    if(bodyParams.u_city != undefined){
       updateParams.u_city = bodyParams.u_city;
    }

    if(bodyParams.u_district != undefined){
       updateParams.u_district = bodyParams.u_district;
    }

    if(bodyParams.u_sign != undefined){
       updateParams.u_sign = bodyParams.u_sign;
    }

    if(bodyParams.u_qin_age != undefined){
       updateParams.u_qin_age = bodyParams.u_qin_age;
    }

    if(bodyParams.u_good_instrument != undefined){
       updateParams.u_good_instrument = bodyParams.u_good_instrument;
    }

    if(bodyParams.u_teacher_instrument != undefined){
       updateParams.u_teacher_instrument = bodyParams.u_teacher_instrument;
    }

    if(bodyParams.u_is_delete != undefined){
       updateParams.u_is_delete = bodyParams.u_is_delete;
    }

    if(bodyParams.u_is_vip != undefined){
       updateParams.u_is_vip = bodyParams.u_is_vip;
    }

    if(bodyParams.u_is_zhubo != undefined){
       updateParams.u_is_zhubo = bodyParams.u_is_zhubo;
    }

    if(bodyParams.u_audio_url != undefined){
       updateParams.u_audio_url = bodyParams.u_audio_url;
    }

    if(bodyParams.u_location != undefined){
       updateParams.u_location = bodyParams.u_location;
    }

    if(bodyParams.u_age != undefined){
       updateParams.u_age = bodyParams.u_age;
    }

    //构建任务流
    async.waterfall([

        //修改用户信息
        function(cb){

            db.where({"u_id":bodyParams.u_id}).update(updateParams,"mu_users",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"用户信息修改失败");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}