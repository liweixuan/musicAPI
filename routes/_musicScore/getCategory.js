exports.getCategory = function(req,res) {

	db.where({"msc_is_delete":0}).select("mu_music_score_category",function(result){

		if(result == 'ERROR'){
			return RES.response(res,false,"曲谱分类获取失败");
		}

		return RES.response(res,true,result);

	});

}