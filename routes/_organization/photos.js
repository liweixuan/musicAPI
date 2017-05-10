exports.photos = function(req,res) {

    //获取restful参数
    var restfulParams = req.routeInfo.restfulParams;

    //团体信息
    var organizationPhotos = [];

    //构建任务流
    async.waterfall([

        //获取团体下的成员列表
        function(cb){

            db.where({"op_oid":restfulParams.op_oid,"op_fid":restfulParams.op_fid,"op_is_delete":0}).select("mu_organization_photo",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"相册照片获取失败");
                }

                organizationPhotos = result;

                cb();

            });

        },

       
    ], function (err, result) {
        return RES.response(res, true,organizationPhotos);
    });

}