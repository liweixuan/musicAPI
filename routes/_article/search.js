exports.search = function(req,res) {

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //查询条件
    var searchParams = {};

    //判断是否增加文章类别查询
    if(restful.a_cid != undefined){
       searchParams.a_cid = restful.a_cid;
    }
    //获取未删除的
    searchParams.a_is_delete = 0;

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

    var articleData = [];

    //构建任务流
    async.waterfall([

        //获取文章信息
        function(cb){

            db.field(fields).where(searchParams).limit(restful.skip,restful.limit).select("mu_article",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"文章信息获取失败");
                }

                articleData = result;

                cb();

            });

        },

        //判断是否有图片类型的文章，并获取相关图片信息
        function(cb){

            //构建一个循环任务
			var tasks = [];

            //循环基本图片数据
			articleData.forEach(function (articleItem, i) {

				//构建每一个商品详细查询任务
				tasks.push(function (callback) {

                    //判断是否为图片文章
                    if(articleItem.a_type == 1){

                        //查询文章图片
                        db.where({"ai_aid" : articleItem.a_id,"ai_is_delete":0}).order("ai_order desc").select("mu_article_image",function(result){

                            articleData[i].images = result;
                            callback();

                        });

                    }else{

                        callback();

                    }

				});

			});

			async.waterfall(tasks, cb);

        },

        function(cb){

            cb();

        }

    ], function (err, result) {
        return RES.response(res, true, articleData);
    });

}