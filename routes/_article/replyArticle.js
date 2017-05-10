exports.replyArticle = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        function(cb){

            var addParams = {
                ac_content     : bodyParams.ac_content,
                ac_uid         : bodyParams.ac_uid,
                ac_aid         : bodyParams.ac_aid,
                ac_create_time : common.nowTime(false),
            } 

            db.add(addParams,"mu_article_comment",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"文章评论失败");
                }

                cb();

            });

        },

        //更新文章评论数量
        function(cb){

            db.where({a_id:bodyParams.ac_aid}).update({"a_comment_count" : "a_comment_count + 1"},"mu_article",function(result){
                cb();
            });
        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}