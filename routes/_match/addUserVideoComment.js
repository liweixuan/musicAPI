exports.addUserVideoComment = function(req,res) {

    //获取restful参数
    var bodyParams = req.routeInfo.bodyParams;

    //当前时间戳
    var nowtime = common.nowTime(false);


    //构建任务流
    async.waterfall([

        //添加评论
        function(cb){

            var addParams = {
                mvc_content     : bodyParams.mvc_content,
                mvc_mpuid       : bodyParams.mvc_mpuid,
                mvc_uid         : bodyParams.mvc_uid,
                mvc_create_time : nowtime
            };

            db.add(addParams,"mu_match_video_comment",function(result){

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