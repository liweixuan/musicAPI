/****************************
 * 接口管理文件,可对接口进行配置(生效范围为接口自身)
 * Key -> method 		   : GET 或 POST 或 ALL
 * Key -> getMustParams    : get请求必传参数配置,值为验证的格式,可在正则配置文件进行配置
 * Key -> getNoMustParams  : get请求非必传参数配置,如不做配置,则不对任何非必传参数进行格式验证,配置后,如果格式不正确,接口请求将无法成功
 * Key -> postMustParams   : post请求必传参数配置,值为验证的格式,可在正则配置文件进行配置
 * Key -> postNoMustParams : post请求非必传参数配置,如不做配置,则不对任何非必传参数进行格式验证,配置后,如果格式不正确,接口请求将无法成功
 * Key -> isMemoryCache    : 该接口是否进行缓存,只对GET请求生效(与服务器设置冲突时,优先生效)
 * Key -> cacheExpiration  : 该接口的缓存生效时间(与服务器设置冲突时,优先生效)
 ****************************/

exports.API = {

	/********** 通用服务接口 **********/

	//获取TST上传接口临时验证信息
	"/_common/getTSTInfo" : {
		method : 'POST'
	},

	//获取地理位置
	"/_common/location" : {
		method : 'ALL',
		getNoMustParams : {
		  fid  : 'NUMBER'
	    }

	},

	//更新本地保存的地址信息
	"/_common/updateLocation" : {
		method : 'POST'
	},

	/********** 乐器类别相关接口 **********/

	//获取乐器类别
	"/_musicCategory/search" : {
		method : 'GET',
		getNoMustParams : {
			c_is_special : 'NUMBER'
		}
	},

	/********** 动态相关接口 **********/

	 //获取动态信息
	 "/_dynamic/search" : {
		 method : 'ALL',
		 getNoMustParams : {
			 limit  : 'NUMBER',
			 skip   : 'NUMBER',
			 d_uid  : 'NUMBER',
			 d_cid  : 'NUMBER',
			 d_type : 'NUMBER'
		 }
	 },

	 //为动态点赞
	 "/_dynamic/zan" : {
		 method : 'POST',
		 postMustParams : {
			d_id : 'NUMBER'
		 }
	 },


	 //为动态评论信息点赞
	 "/_dynamic/commentZan" : {
		 method : 'POST',
		 postMustParams : {
			dc_id : 'NUMBER'
		 }
	 },

	 //回复动态
	 "/_dynamic/replyDynamic" : {
		 method : 'POST',
		 postMustParams : {
			dc_uid : 'NUMBER',
			dc_did : 'NUMBER',
			dc_content : ''
		 }
	 },

	 //回复动态评论
	 "/_dynamic/replyDynamicComment" : {
		 method : 'POST',
		 postMustParams : {
			dc_uid : 'NUMBER',
			dc_did : 'NUMBER',
			dc_content : '',
			dc_reply_uid : '',
		 }
	 },

	 //获取动态评论信息
	 "/_dynamic/searchComment" : {
		 method : 'ALL',
		 getMustParams : {
			dc_did : 'NUMBER'
		 },
		 getNoMustParams : {
			 limit  : 'NUMBER',
			 skip   : 'NUMBER'
		 }
	 },

	 //发布动态信息
	 "/_dynamic/add" : {
		method : 'POST',
		postMustParams : {
			d_content 	 : '',
			d_type       : 'NUMBER',
			d_uid 		 : 'NUMBER',
			d_tags 	     : '',
			d_cid 		 : 'NUMBER'
		}
	 },

	/********** 伙伴相关 **********/

	//找伙伴信息获取
	"/_partner/search" : {
		method : 'ALL',
		getNoMustParams : {
			 limit  	 : 'NUMBER',
			 skip     	 : 'NUMBER',
			 u_sex  	 : 'NUMBER',
			 fp_province : 'NUMBER',
			 fp_city 	 : 'NUMBER',
			 fp_district : 'NUMBER'
		 }
	},

	//添加找伙伴信息
	"/_partner/add" : {
		method : 'POST',
		postMustParams : {
			fp_title : '',
			fp_tag 	 : '',
			fp_uid   : 'NUMBER',
			fp_desc  : '',
			fp_ask   : ''
		}
	},

	/********** 好友相关 **********/

	//申请好友
	"/_friends/apply" : {
		method : 'POST'
	},

	/** 
	 * 用户相关接口
	 **/

	 //关注某用户
	 "/_user/addUserConcern" : {
		 method : 'POST',
		 postMustParams : {
			uc_uid 		  : 'NUMBER',
			uc_concern_id : "NUMBER"
		 }
	 },

	 //取消关注某用户
	 "/_user/cancelUserConcern" : {
		 method : 'POST',
		 postMustParams : {
			uc_uid 		  : 'NUMBER',
			uc_concern_id : "NUMBER"
		 }
	 },

	 //获取用户详细信息
	 "/_user/info" : {
		method : 'GET',
		getMustParams : {
			u_id : 'NUMBER'
		}
	 },

	 //修改用户资料
	 "/_user/updateInfo" : {
		 method : 'POST',
		 postMustParams : {
			 u_id : 'NUMBER'
		 },
		 postNoMustParams : {
			 u_nickname 		  : '',
			 u_realname   		  : '',
			 u_header_url 		  : '',
			 u_sex 				  : '',
			 u_money 			  : '',
			 u_is_teacher 		  : '',
			 u_is_sponsors 		  : '',
			 u_address 			  : '',
			 u_official_teacher   : '',
			 u_province 		  : '',
			 u_city 			  : '',
			 u_district 		  : '',
			 u_sign 			  : '',
			 u_qin_age 			  : '',
			 u_good_instrument    : '',
			 u_teacher_instrument : '',
			 u_is_delete 		  : '',
			 u_is_vip 			  : '',
			 u_is_zhubo 		  : '',
			 u_audio_url		  : ''
		 }
	 },

	/********** 团体相关 **********/
	
	//获取团体信息
	"/_organization/search" : {
		method : 'ALL',
		getNoMustParams : {
			 limit  	 : 'NUMBER',
			 skip   	 : 'NUMBER',
			 o_id  		 : 'NUMBER',
			 o_province  : 'NUMBER',
			 o_city 	 : 'NUMBER',
			 o_district  : 'NUMBER'
		 }
	},

	//获取团体详细
	"/_organization/info" : {
		method : 'GET',
		getMustParams : {
			o_id : 'NUMBER'
		}
	},

	//获取团体成员列表
	"/_organization/members" : {
		method : 'GET',
		getMustParams : {
			o_id : 'NUMBER'
		}
	},

	//获取团体某相册下所有照片
	"/_organization/photos" : {
		method : 'GET',
		getMustParams : {
			op_oid : 'NUMBER',
			op_fid : 'NUMBER'
		}
	},

	//关注团体
	"/_organization/addOrganizationConcern" : {
		method : 'POST',
		postMustParams : {
			oc_uid 		   : 'NUMBER',
			oc_concern_oid : 'NUMBER'
		}
	},

	//取消关注团体
	"/_organization/cancelOrganizationConcern" : {
		method : 'POST',
		postMustParams : {
			oc_uid 		   : 'NUMBER',
			oc_concern_oid : 'NUMBER'
		}
	},

	//创建团体
	"/_organization/add" : {
		method : 'POST',
		postMustParams : {
			o_name 		    : '',
			o_logo 			: '',
			o_cover			: '',
			o_province 		: '',
			o_city 			: '',
			o_district 		: '',
			o_type 			: '',
			o_create_userid : ''
		}
	},

	/********** 活动相关 **********/

	//获取活动信息
	"/_activity/search" : {
		method : 'ALL',
		getNoMustParams : {
			 limit  	 : 'NUMBER',
			 skip     	 : 'NUMBER',
			 a_id  	     : 'NUMBER',
			 a_province  : 'NUMBER',
			 a_city 	 : 'NUMBER',
			 a_district  : 'NUMBER',
			 a_hold_type : 'NUMBER'
		}
	},

	//获取活动详细信息
	"/_activity/info" : {
		method : 'GET',
		getMustParams : {
			 a_id  	     : 'NUMBER'
		}
	},

	//新增活动意向
	"/_activity/addIntention" : {
		method : 'POST',
		postMustParams : {
			ai_uid : 'NUMBER',
			ai_aid : 'NUMBER'
		}
	},

	//新增活动报名
	"/_activity/addApply" : {
		method : 'POST',
		postMustParams : {
			aa_uid  : 'NUMBER',
			aa_aid  : 'NUMBER'
		}
	},

	//新增活动
	"/_activity/add" : {
		method : 'POST',
		postMustParams : {
			a_title 			  : '',
			a_hold_type 	 	  : '',
			a_province   		  : '',
			a_city  			  : '',
			a_district  		  : '',
			a_address 			  : '',
			a_participation_style : '',
			a_holding_start_time  : '',
			a_holding_end_time    : '',
			a_desc 				  : '',
			a_user_max_count 	  : '',
			a_ask 				  : '',
			a_uid 				  : ''
		}
	},

	/********** 教师相关 **********/
	
	//获取教师信息
	"/_teacher/search" : {
		method : 'GET',
		getNoMustParams : {
			u_teacher_instrument : 'NUMBER',
			u_official_teacher 	 : 'NUMBER',
			u_sex 				 : 'NUMBER',
			u_province 			 : 'NUMBER',
			u_city 				 : 'NUMBER',
			u_district 			 : 'NUMBER',
			skip 			     : 'NUMBER',
			limit 			     : 'NUMBER'
		}
	},

	/********** 教学相关 **********/

	//获取用户的某分类的乐器阶段
	"/_teaching/searchStage" : {
		method : 'GET',
		getMustParams : {
			u_id   : 'NUMBER',
			c_id   : 'NUMBER'
		}
	},

	//获取课程节点
	"/_teaching/searchNode" : {
		method : 'GET',
		getMustParams : {
			iln_ilid : 'NUMBER'
		}	
	},

	//获取课程详细
	"/_teaching/searchDetail" : {
		method : 'GET',
		getMustParams : {
			iln_id : 'NUMBER'
		}
	},

	//获取课程评论信息
	"/_teaching/searchComment" : {
		method : 'GET',
		getMustParams : {
			ilnc_ilnid : 'NUMBER'
		}
	},

	//为该节点课程点赞
	"/_teaching/nodeZan" : {
		method : 'POST',
		postMustParams : {
			iln_id : 'NUMBER'
		}
	},

	//为该节点课程评论点赞
	"/_teaching/commentZan" : {
		method : 'POST',
		postMustParams : {
			ilnc_id : 'NUMBER'
		}
	},

	//回复节点课程
	"/_teaching/reply" : {
		method : 'POST',
		postMustParams : {
			ilnc_uid       : 'NUMBER',
			ilnc_ilnid     : 'NUMBER',
			ilnc_content   : ''
		}
	},
	

	//回复节点课程评论
	"/_teaching/replyComment" : {
		method : 'POST',
		postMustParams : {
			ilnc_uid       : 'NUMBER',
			ilnc_ilnid     : 'NUMBER',
			ilnc_content   : '',
			ilnc_reply_uid : 'NUMBER'
		}
	},

	//新增课程问题
	"/_teaching/addQuestions" : {
		method : 'POST',
		postMustParams : {
			ilnq_content : '',
			ilnq_uid 	 : 'NUMBER'
		}
	},

	//获取课程关联的曲谱
	"/_teaching/searchNodeScore" : {
		method : 'GET',
		getMustParams : {
			ilns_type  : 'NUMBER',
			ilns_ilnid : 'NUMBER'
		}
	},

	//获取某独立教师的课程
	"/_teaching/teacherCourse" : {
		method : 'GET',
		getMustParams : {
			teacher_id : 'NUMBER'
		}
	},

	//获取独立教师的课程模式列表
	"/_teaching/courseList" : {
		method : 'GET',
		getNoMustParams : {
			tc_cid : 'NUMBER'
		}
	},

	//获取独立教师的课程阶段
	"/_teaching/teacherCourseStage" : {
		method : 'GET',
		getMustParams : {
			u_id	 : 'NUMBER',
			tcs_tcid : 'NUMBER'
		}
	},

	//获取独立教师的课程节点
	"/_teaching/teacherCourseNode" : {
		method : 'GET',
		getMustParams : {
			tcn_tcsid : 'NUMBER'
		}
	},

	//获取独立教师某节课程详细
	"/_teaching/teacherCourseDetail" : {
		method : 'GET',
		getMustParams : {
			teacher_id : 'NUMBER',
			tcn_id 	   : 'NUMBER'
		}
	},

	//获取独立教师某节课程评论
	"/_teaching/teacherCourseNodeComment" : {
		method : 'GET',
		getMustParams : {
			tcnc_tcnid : 'NUMBER'
		}
	},

	//为独立教师课程点赞
	"/_teaching/teacherCourseNodeZan" : {
		method : 'POST',
		postMustParams : {
			tcn_id : 'NUMBER'
		}
	},

	//为独立教师课程评论点赞
	"/_teaching/teacherCourseNodeCommentZan" : {
		method : 'POST',
		postMustParams : {
			tcnc_id : 'NUMBER'
		}
	},

	//新增独立教师课程提问
	"/_teaching/addTeacherCourseQuestions" : {
		method : 'POST',
		postMustParams : {
			tcnq_content   : '',
			tcnq_uid 	   : 'NUMBER',
			tcnq_teacherId : 'NUMBER'
		}
	},

	//评论独立教师课程
	"/_teaching/replyTeacherCourse" : {
		method : 'POST',
		postMustParams : {
			tcnc_content   : '',
			tcnc_uid 	   : 'NUMBER',
			tcnc_tcnid     : 'NUMBER'
		}
	},

	//回复独立教师课程的评论
	"/_teaching/replyTeacherCourseComment" : {
		method : 'POST',
		postMustParams : {
			tcnc_content   : '',
			tcnc_uid 	   : 'NUMBER',
			tcnc_tcnid     : 'NUMBER',
			tcnc_reply_uid : 'NUMBER'
		}
	},

	//获取独立教师课程关联的曲谱
	"/_teaching/teacherCourseNodeScore" : {
		method : 'GET',
		getMustParams : {
			tcns_type  : 'NUMBER',
			tcns_tcnid : 'NUMBER'
		}
	},

	/********** 音乐视频相关 **********/

	//获取音乐视频
	"/_video/search" : {
		method : 'GET',
		getNoMustParams : {
			v_cid : 'NUMBER'
		}
	},

	//添加视频的评论
	"/_video/replyVideo" : {
		method : 'POST',
		postMustParams : {
			vc_uid : 'NUMBER',
			vc_vid : 'NUMBER',
			vc_content : ''
		}
	},

	//回复视频的评论
	"/_video/replyVideoComment" : {
		method : 'POST',
		postMustParams : {
			vc_uid 	 	 : 'NUMBER',
			vc_vid 	   	 : 'NUMBER',
			vc_content   : '',
			vc_reply_uid : 'NUMBER',
		 }
	},

	//为视频点赞
	"/_video/zan" : {
		method : 'POST',
		postMustParams : {
			v_id : 'NUMBER'
		}
	},

	//为视频评论点赞
	"/_video/commentZan" : {
		method : 'POST',
		postMustParams : {
			vc_id : 'NUMBER'
		}
	},

	//获取视频评论信息
	"/_video/searchComment" : {	
		method : 'ALL',
		getMustParams : {
			vc_vid : 'NUMBER'
		},
		getNoMustParams : {
			limit  : 'NUMBER',
			skip   : 'NUMBER'
		}
	},

	/********** 文章相关 **********/

	//获取文章列表数据
	"/_article/search" : {
		method : 'ALL',
		getNoMustParams : {
			 limit  : 'NUMBER',
			 skip   : 'NUMBER',
			 a_cid  : 'NUMBER'
		}
	},

	//添加文章的评论
	"/_article/replyArticle" : {
		method : 'POST',
		postMustParams : {
			ac_uid : 'NUMBER',
			ac_aid : 'NUMBER',
			ac_content : ''
		}
	},

	//回复文章的评论
	"/_article/replyArticleComment" : {
		method : 'POST',
		postMustParams : {
			ac_uid 	 	 : 'NUMBER',
			ac_aid 	   	 : 'NUMBER',
			ac_content   : '',
			ac_reply_uid : 'NUMBER',
		 }
	},

	//为文章点赞
	"/_article/zan" : {
		method : 'POST',
		postMustParams : {
			a_id : 'NUMBER'
		}
	},

	//为文章评论点赞
	"/_article/commentZan" : {
		method : 'POST',
		postMustParams : {
			ac_id : 'NUMBER'
		}
	},

	//获取文章评论信息
	"/_article/searchComment" : {	
		method : 'ALL',
		getMustParams : {
			ac_aid : 'NUMBER'
		},
		getNoMustParams : {
			limit  : 'NUMBER',
			skip   : 'NUMBER'
		}
	},

	/********** 比赛相关 **********/
	//获取比赛信息
	"/_match/search" : {
		method : 'ALL',
		getNoMustParams : {
			 limit    : 'NUMBER',
			 skip     : 'NUMBER',
			 m_cid    : 'NUMBER',
			 m_status : 'NUMBER'
		}
	}

};





















