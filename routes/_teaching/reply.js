exports.reply = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //为评论点赞
        function(cb){

            var addParams = {
                ilnc_content     : bodyParams.ilnc_content,
                ilnc_uid         : bodyParams.ilnc_uid,
                ilnc_ilnid       : bodyParams.ilnc_ilnid,
                ilnc_create_time : common.nowTime(false)
            } 

            db.add(addParams,"mu_instruments_level_node_comment",function(result){

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