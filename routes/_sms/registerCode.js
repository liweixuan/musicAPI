exports.registerCode = function(req,res) {

    //获取restful参数
    var bodyParams = req.routeInfo.bodyParams;

    var randomValue = 0;

    var codeModel = 0; // 短信入库模式 0-添加 1-更新

    //构建任务流
    async.waterfall([

        //判断该手机号码是否已注册过
        function(cb){

            db.where({"u_username":bodyParams.phone}).count("mu_users",function(result){

                if(result == 'ERROR'){  
                    console.log(1);
                    return RES.response(res,false,"短信发送失败");
                }

                if(result > 0){
                    return RES.response(res,false,"该用户已被注册");
                }

                cb();

            });


        },

        //判断短信表中是否存在该手机号码
        function(cb){

            db.where({"s_iphone" : bodyParams.phone}).count("mu_sms",function(result){

                if(result == 'ERROR'){
                    console.log(2);
                    return RES.response(res,false,"短信发送失败");
                }

                if(result > 0){
                    codeModel = 1;
                }

                cb();


            });
        },

        //将手机短信写入数据库
        function(cb){

          //生成6位随机数
          randomValue = common.getVerificationCode();

          var params = {

            s_code      : randomValue,
            s_iphone    : bodyParams.phone,
            s_send_time : common.nowTime(false)

          };

          if(codeModel == '0'){

            //添加
            db.add(params,"mu_sms",function(result){

                if(result == 'ERROR'){
                    console.log(3);
                    return RES.response(res,false,"短信发送失败");
                }

                cb();

            });


          }else{

            //更新
            db.where({"s_iphone":bodyParams.phone}).update(params,"mu_sms",function(result){

                if(result == 'ERROR'){
                    console.log(4);
                    return RES.response(res,false,"短信发送失败");
                }

                cb();

            });
          }
        },


        //发送手机短信操作
        function(cb){
            R.SEND_HTTP(
                req,
                {
                    url    : "http://localhost/musicUtopiaService/MD_SMS/sms.php?phone=" + bodyParams.phone + "&randomValue=" + randomValue + "&type=REGISTER_CODE",
                    method : 'GET'
                },
                function (err, data) {

                    if(err){

                        return RES.response(res,false,data);

                    }

                    cb();
                }
            );
        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}