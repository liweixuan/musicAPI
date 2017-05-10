exports.info = function(req,res) {

    //获取restful参数
	var restful = req.routeInfo.restfulParams;

    var activityInfo = {};

    //构建任务流
    async.waterfall([

        //获取动态信息
        function(cb){

            db.where({"a_id":restful.a_id}).select("v_activity_info",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"活动信息获取失败");
                }

                activityInfo.detail = result[0];

                cb();

            });

        },

        //获取活动场地照片
        function(cb){

            db.where({"asp_aid":restful.a_id,"asp_is_delete":0}).select("mu_activity_site_photo",function(result){

                if(result == 'ERROR'){
                    activityInfo.photos = [];
                }

                activityInfo.photos = result;

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true, activityInfo);
    });

}