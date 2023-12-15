viewModel.on("customInit", function (data) {
  // 访客填写预约--页面初始化
  cb.rest.invokeFunction(
    "3a4bcf2ef46e48809111a2d1516d89b5",
    {},
    function (err, res) {
      debugger;
      console.log("---------------");
      console.log(res);
      var uid = res.currentUser.id;
      console.log(uid);
      if (uid != undefined) {
        // 获取查询区模型
        const filtervm = viewModel.getCache("FilterViewModel");
        filtervm.on("afterInit", function () {
          // 进行查询区相关扩展
          filtervm.get("user_id").getFromModel().setValue(uid);
        });
      }
    },
    viewModel
  );
});
//提交前
// 用于list页面
viewModel.on("beforeBatchsubmit", function (args) {
  debugger;
  //获取表单数据
  let jsonStr = args.data.data;
  let data = JSON.parse(jsonStr);
  var judge = 0;
  var merror = "请填写必要信息：";
  if (data[0].vistor_name == undefined) {
    judge = 1;
    merror += "访客姓名、";
  }
  if (data[0].phone == undefined) {
    judge = 1;
    merror += "联系电话、";
  }
  if (data[0].certificate_type == undefined) {
    judge = 1;
    merror += "证件类型、";
  }
  if (data[0].certificate_num == undefined) {
    judge = 1;
    merror += "证件号码、";
  }
  if (data[0].vistor_reason == undefined) {
    judge = 1;
    merror += "访客事由、";
  }
  if (data[0].appointment_time == undefined) {
    judge = 1;
    merror += "预约时间、";
  }
  if (data[0].effective_day == undefined) {
    judge = 1;
    merror += "有效天数、";
  }
  if (data[0].trip_code == undefined) {
    judge = 1;
    merror += "行程码、";
  }
  if (data[0].health_code == undefined) {
    judge = 1;
    merror += "健康码、";
  }
  if (data[0].people_image == undefined) {
    judge = 1;
    merror += "人脸照、";
  }
  console.log(data);
  if (judge == 1) {
    cb.utils.alert(merror);
    return false;
  }
});