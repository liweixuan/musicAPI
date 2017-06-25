exports.lookAroundSearch = function(req,res) {

    //获取restful参数
    var restfulParams = req.routeInfo.restfulParams;

    //最终用户数据
    var userData = [];

    //用户位置
    var UserLocation = mongoose.model("UserLocation");

    //分页参数
    var limitParams = {};

    //拼接分页参数
    if(restfulParams.limit == undefined){
        limitParams.limit = config.publicConfig.LIMIT;
    }else{
        limitParams.limit = restfulParams.limit;
    }

    if(restfulParams.skip == undefined){
         limitParams.skip = 1;
    }else{
        limitParams.skip = restfulParams.skip;
    }

    //所有正常使用用户
    restfulParams.u_is_delete = 0;

    //构建任务流
    async.waterfall([

        //查询距离坐标点最近的用户信息
        function(cb){

            UserLocation.find({
                'location': {
                    $nearSphere: {
                        $geometry: {
                            type : "Point",
                            coordinates : [restfulParams.longitude,restfulParams.latitude]
                        }
                    }
                }
            }).limit(parseInt(limitParams.limit)).skip(parseInt(limitParams.skip)).exec(function(err,doc){

                userData = doc;

                cb();

            });
        },

        //计算距离
        function(cb){

            for(var i = 0;i<userData.length;i++){

                var disanceValue = getDisance(restfulParams.latitude,restfulParams.longitude,userData[i].location[1],userData[i].location[0]);
                
                userData[i].disance = parseInt(disanceValue);

            }

            cb();
        }

    ], function (err, result) {
        return RES.response(res, true,userData);
    });

}

function toRad(d) {  return d * Math.PI / 180; }

//lat为纬度, lng为经度, 一定不要弄错
function getDisance(lat1, lng1, lat2, lng2) { 
    var dis = 0;
    var radLat1 = toRad(lat1);
    var radLat2 = toRad(lat2);
    var deltaLat = radLat1 - radLat2;
    var deltaLng = toRad(lng1) - toRad(lng2);
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    return dis * 6378137;
}