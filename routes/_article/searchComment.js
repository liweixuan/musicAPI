exports.searchComment = function(req,res) {

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //拼接分页参数
    if(restful.limit == undefined){
        restful.limit = config.publicConfig.LIMIT;
    }

    if(restful.skip == undefined){
         restful.skip = 0;
    }

    //转化所需字段
    var fields = "";
    if(bodyParams != undefined && bodyParams.fields != undefined){

        //拼接字段显示字符串
        if(bodyParams.fields.length > 0){
            fields = bodyParams.fields.join(",");
        }
    }

    var articleCommentData = [];

    //构建任务流
    async.waterfall([

        //获取文章评论信息
        function(cb){

            db.field(fields).where({"ac_aid":restful.ac_aid,ac_is_delete:0}).limit(restful.skip,restful.limit).select("v_article_comment_user",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"文章评论获取失败");
                }

                articleCommentData = result;

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true, articleCommentData);
    });

}