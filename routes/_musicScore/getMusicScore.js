exports.getMusicScore = function(req,res) {

    //获取body参数
    var restful = req.routeInfo.restfulParams;

    //查询条件
    var searchParams = {};

    //模糊搜索条件
    var blurrySearch = "";

    //判断是否增加类别ID查询条件
    if(restful.ms_mscid != undefined){
       searchParams.ms_mscid = restful.ms_mscid;
    }

    //判断是否增加曲谱名称查询条件
    if(restful.ms_name != undefined){
       blurrySearch = restful.ms_name;
    }

    //拼接分页参数
    if(restful.limit == undefined){
        restful.limit = config.publicConfig.LIMIT;
    }

    if(restful.skip == undefined){
         restful.skip = 0;
    }

	var musicScoreData = [];

    //构建任务流
    async.waterfall([

        //获取曲谱信息
        function(cb){

            db.where(searchParams).attachWhere("ms_name like '%"+blurrySearch+"%'").order("ms_id desc").limit(restful.skip,restful.limit).select("mu_music_score",function(result){
                

                if(result == 'ERROR'){
                    return RES.response(res,false,"曲谱信息获取失败");
                }

                musicScoreData = result;

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true, musicScoreData);
    });

}