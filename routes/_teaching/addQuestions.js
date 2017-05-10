exports.addQuestions = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        //添加课程提问
        function(cb){

            var addParams = {
                ilnq_content     : bodyParams.ilnq_content,
                ilnq_uid         : bodyParams.ilnq_uid,
                ilnq_create_time : common.nowTime(false)
            };

            db.add(addParams,"mu_instruments_level_node_questions",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"提问成功，等待回复");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}