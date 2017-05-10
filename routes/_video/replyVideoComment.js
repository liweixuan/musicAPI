exports.replyVideoComment = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //为评论点赞
        function(cb){

            var addParams = {
                vc_content     : bodyParams.vc_content,
                vc_uid         : bodyParams.vc_uid,
                vc_vid         : bodyParams.vc_vid,
                vc_reply_uid   : bodyParams.vc_reply_uid,
                vc_is_reply    : 1,
                vc_create_time : common.nowTime(false),
            } 

            db.add(addParams,"mu_video_comment",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"评论回复失败");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}