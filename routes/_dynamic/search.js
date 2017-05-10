exports.search = function(req,res) {

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //查询条件
    var searchParams = {};

    //判断是否增加用户ID查询条件
    if(restful.d_uid != undefined){
       searchParams.d_uid = restful.d_uid;
    }

    //判断是否增加乐器类型查询条件
    if(restful.d_cid != undefined){
       searchParams.d_cid = restful.d_cid;
    }

    //判断是否增加动态类型查询条件
    if(restful.d_type != undefined){
       searchParams.d_type = restful.d_type;
    }

    //获取未删除的
    searchParams.d_is_delete = 0;

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

    var dynamicData = [];

    //构建任务流
    async.waterfall([

        //获取动态信息
        function(cb){

            db.field(fields).where(searchParams).limit(restful.skip,restful.limit).select("v_dynamic_user",function(result){
                

                if(result == 'ERROR'){
                    return RES.response(res,false,"动态信息获取失败");
                }

                dynamicData = result;

                cb();

            });

        },

        //如果为图片类型获取图片
        function(cb){

            //构建一个循环任务
			var tasks = [];

            //循环基本图片数据
			dynamicData.forEach(function (dynamicItem, i) {

				//构建每一个商品详细查询任务
				tasks.push(function (callback) {

                    //判断是否为图片文章
                    if(dynamicItem.d_type == 1){

                        //查询文章图片
                        db.where({"di_did" : dynamicItem.d_id,"di_is_delete":0}).order("di_order desc").select("mu_dynamic_image",function(result){

                            dynamicData[i].images = result;
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
        return RES.response(res, true, dynamicData);
    });

}