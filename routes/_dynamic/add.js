exports.add = function(req,res) {

    
    common.sleep(2000);

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //新增的动态ID
    var d_id = 0;  

    //需要上传的图片总数
    var imageCount = 0;

    //已完成数
    var successImageCount = 0;

    //构建任务流
    async.waterfall([
        
        //新增动态信息
        function(cb){

            var addParams = {
                d_content     : bodyParams.d_content,
                d_type        : bodyParams.d_type,
                d_create_time : common.nowTime(false),
                d_uid         : bodyParams.d_uid,
                d_tags        : bodyParams.d_tags,
                d_cid         : bodyParams.d_cid,
                d_video_type  : bodyParams.d_video_type  == undefined ? 0  : bodyParams.d_location,
                d_location    : bodyParams.d_location    == undefined ? "" : bodyParams.d_location
            };

            db.add(addParams,"mu_dynamic",function(result){
                if(result == 'ERROR'){
                    return RES.response(res,false,"动态新增失败");
                }

                //保存动态ID
                d_id = result;

                cb();
            });
            
        },

        //根据类型做相应处理
        function(cb){

            //不是图片类型直接跳过
            if(bodyParams.d_type != 1){
                return cb();
            }
            
            //判断是否传递图片参数
            if(bodyParams.d_images == undefined || bodyParams.d_images.length <= 0){
                 return RES.response(res,false,"动态新增失败");
            }

            //构建一个循环任务
			var tasks = [];

            //需要上传的图片总数
            imageCount = bodyParams.d_images.length;

            //循环基本图片数据
			bodyParams.d_images.forEach(function (imageItem, i) {

				//构建每一个商品详细查询任务
				tasks.push(function (callback) {

                    var addImageParams = {
                        di_img_url : imageItem,
                        di_did     : d_id
                    };

					//新增图片
					db.add(addImageParams,"mu_dynamic_image", function (result) {

                        if(result == 'ERROR'){
                           return cb();  
                        }

                        successImageCount++;

						callback();
					});
				});

			});

			async.waterfall(tasks, cb);

        },

        function(cb){
            
            //判断是否上传完成
            if(imageCount == successImageCount){
                cb();
            }else{
                return RES.response(res, false,"动态新增失败");
            }
        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}

