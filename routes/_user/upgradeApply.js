exports.upgradeApply = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //查看是否已经申请过该类别与级别
        function(cb){

            db.where({"uuv_cid":bodyParams.uuv_cid,"uuv_level":bodyParams.uuv_level}).order("uuv_status asc").select("mu_user_upgrade_video",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"升级视频提交失败");
                }

                var upgradeInfo = result[0];

                if(result.length > 0 && upgradeInfo.uuv_status == 0){
                    return RES.response(res,false,"您已经提交过该乐器级别，请耐心等待评测");
                }

                if(result.length > 0 && upgradeInfo.uuv_status == 1){
                    return RES.response(res,false,"您已通过了该乐器级别的考试，请勿重复申请");
                }

                cb();

            });
        },

        //新增申请
        function(cb){

            var addParams = {
                uuv_video_url   : bodyParams.uuv_video_url,
                uuv_uid         : bodyParams.uuv_uid,
                uuv_create_time : common.nowTime(false),
                uuv_image_url   : bodyParams.uuv_image_url,
                uuv_cid         : bodyParams.uuv_cid,
                uuv_level       : bodyParams.uuv_level,
            };


            db.add(addParams,"mu_user_upgrade_video",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"升级视频提交失败");
                }

                
                cb();


            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}