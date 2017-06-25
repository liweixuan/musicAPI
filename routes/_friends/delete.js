exports.delete = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //条件
    var searchParams = { f_username : bodyParams.f_username, f_fusername : bodyParams.f_fusername }; 

    //构建任务流
    async.waterfall([

        //删除好友
        function(cb){

            db.where(searchParams).del("mu_friends",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"好友删除失败");
                }

                cb();
            });

        },

        //从对方的好友列表中删除
        function(cb){

            db.where({f_username : bodyParams.f_fusername, f_fusername : bodyParams.f_username}).del("mu_friends",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"好友删除失败");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}