exports.replyDynamicComment = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //为评论点赞
        function(cb){

            var addParams = {
                dc_content     : bodyParams.dc_content,
                dc_uid         : bodyParams.dc_uid,
                dc_did         : bodyParams.dc_did,
                dc_reply_uid   : bodyParams.dc_reply_uid,
                dc_is_reply    : 1,
                dc_create_time : common.nowTime(false),
            } 

            db.add(addParams,"mu_dynamic_comment",function(result){

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