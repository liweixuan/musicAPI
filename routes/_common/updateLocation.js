var fs   = require("fs");
var path = require("path");

exports.updateLocation = function(req,res) {

	db.select("mu_location",function(result){

		if(result == 'ERROR'){
			return RES.response(res,true,"地理位置信息文件更新失败");
		}

        var staticTouch = path.join(__dirname, '../../') + "/staticAllocation/location.json";

        var locationData = {};
        for(var i = 0;i<result.length;i++){
            locationData[result[i].l_id] = {name : result[i].l_name};
        }

        //创建文件
        fs.writeFile(staticTouch,JSON.stringify(locationData),function(err){
            if(err){
                return RES.response(res,true,"地理位置信息文件更新失败");
            }

            return RES.response(res,true,"地理位置信息文件更新完成");
        });

		

	});

}