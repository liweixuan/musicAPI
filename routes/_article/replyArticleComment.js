exports.replyArticleComment = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //为评论点赞
        function(cb){

            var addParams = {
                ac_content     : bodyParams.ac_content,
                ac_uid         : bodyParams.ac_uid,
                ac_aid         : bodyParams.ac_aid,
                ac_reply_uid   : bodyParams.ac_reply_uid,
                ac_is_reply    : 1,
                ac_create_time : common.nowTime(false),
            } 

            db.add(addParams,"mu_article_comment",function(result){

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