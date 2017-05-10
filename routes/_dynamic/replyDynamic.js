exports.replyDynamic = function(req,res) {

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
                dc_create_time : common.nowTime(false),
            } 

            db.add(addParams,"mu_dynamic_comment",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"动态评论失败");
                }

                cb();

            });

        },

        //更新动态评论数量
        function(cb){

            db.where({d_id:bodyParams.dc_did}).update({"d_comment_count" : "'d_comment_count' + 1"},"mu_dynamic",function(result){
                cb();
            });
        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}