exports.hotSearchKeyword = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //热度词是否存在
    var isExist = 0;  //0-不存在 1-存在

    //关键词主键ID
    var mshkId = 0;

    //构建任务流
    async.waterfall([

        //查看该词是否存在
        function(cb){

            db.field("mshk_id").where({"mshk_name":bodyParams.mshk_name}).select("mu_music_score_hot_keyword",function(result){

                console.log(result);

                if(result == 'ERROR'){
                    return RES.response(res,false,"热度词保存失败");
                }

                if(result.length > 0){
                    isExist = 1;
                    mshkId = result[0].mshk_id;
                }
                cb();

            });

        },

        //根据是否存在做相应操作
        function(cb){

            //不存在，则创建该关键词
            if(isExist == 0){

                var addParams = {
                    mshk_name : bodyParams.mshk_name
                };

                db.add(addParams,"mu_music_score_hot_keyword",function(result){

                    if(result == 'ERROR'){
                        return RES.response(res,false,"热度词保存失败");
                    }

                    cb();

                });

            //存在则更新数量    
            }else{
            
             db.where({"mshk_id":mshkId}).updateInc("mshk_count","mu_music_score_hot_keyword",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"热度词保存失败");
                }

                cb();
            });

        }

    }], function (err, result) {
        return RES.response(res, true);
    });

}