viewModel.get("invitation_code") &&
  viewModel.get("invitation_code").on("afterValueChange", function (data) {
    // 邀请码--值改变后
    function newPseudoGuid() {
      var guid = "";
      for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if (i == 8 || i == 12 || i == 16 || i == 20) guid += "-";
      }
      return guid;
    }
    var code = newPseudoGuid();
    var codes;
    cb.rest.invokeFunction(
      "17dd02a8c87e45e3be6cd140ba475579",
      {
        code: code
      },
      function (err, res) {
        console.log(err);
        console.log(res);
        viewModel.get("invitation_code").setValue(String(JSON.parse(res.apiResponse).data));
        codes = String(JSON.parse(res.apiResponse).data);
        cb.rest.invokeFunction("4ef9f2a7278c44b69bd8afd541a305d1", {}, function (err, res) {
          console.log("++++++++++++");
          console.log(err);
          console.log(res);
          viewModel.get("invitation_link").setValue("链接地址：" + res.res[0].InviteLink + " 邀请码：" + codes);
        });
      }
    );
  });
viewModel.get("user_id") &&
  viewModel.get("user_id").on("afterValueChange", function (data) {
    // 用户ID--值改变后
    cb.rest.invokeFunction("3a4bcf2ef46e48809111a2d1516d89b5", {}, function (err, res) {
      var uid = res.currentUser.id;
      viewModel.get("user_id").setValue(String(uid));
    });
  });
viewModel.get("button18jh") &&
  viewModel.get("button18jh").on("click", function (data) {
    // 下发至设备--单击
    const vistor_name = viewModel.get("vistor_name").getValue();
    const vistor_id = viewModel.get("certificate_num").getValue();
    const certificate_num = viewModel.get("certificate_num").getValue();
    const picinfo = viewModel.get("pic_base64_code").getValue();
    const devicegroup = viewModel.get("shebeifengzu").getValue();
    const appointment_time = viewModel.get("appointment_time").getValue();
    const effective_day = viewModel.get("effective_day").getValue();
    cb.rest.invokeFunction(
      "16d62ab3ec4149f8a578fbb37454ea9e",
      {
        vistor_name: vistor_name,
        vistor_id: vistor_id,
        certificate_num: certificate_num,
        picinfo: picinfo,
        appointment_time: appointment_time,
        effective_day: effective_day,
        devicegroup: devicegroup
      },
      function (err, res) {
        console.log(err);
        console.log(res);
        cb.utils.alert("操作成功", "success");
      }
    );
  });
viewModel.on("customInit", function (data) {
  // 员工发起预约详情--页面初始化
  var viewModel = this;
  //页面DOM完成，无形参，可直接操作模型
  viewModel.on("afterLoadData", function () {
    //用于列表页面，初始化一些操作可以在这里实现，需要操作模型的，需要在此钩子函数执行
  });
});
viewModel.get("button24vd") &&
  viewModel.get("button24vd").on("click", function (data) {
    // 按钮--单击
    if (viewModel.get("button24vd").getValue() == null) {
      viewModel.get("vistor_name").setVisible(false);
      viewModel.get("phone").setVisible(false);
      viewModel.get("certificate_type").setVisible(false);
      viewModel.get("certificate_num").setVisible(false);
      viewModel.get("vistor_reason").setVisible(false);
      viewModel.get("appointment_time").setVisible(false);
      viewModel.get("effective_day").setVisible(false);
      viewModel.get("car_num").setVisible(false);
      viewModel.get("accompanying_peoples").setVisible(false);
      viewModel.get("trip_code").setVisible(false);
      viewModel.get("health_code").setVisible(false);
      viewModel.get("people_image").setVisible(false);
      viewModel.get("button24vd").setValue("关于访客信息");
    } else if (viewModel.get("button24vd").getValue() == "员工必填信息") {
      viewModel.get("vistor_name").setVisible(false);
      viewModel.get("phone").setVisible(false);
      viewModel.get("certificate_type").setVisible(false);
      viewModel.get("certificate_num").setVisible(false);
      viewModel.get("vistor_reason").setVisible(false);
      viewModel.get("appointment_time").setVisible(false);
      viewModel.get("effective_day").setVisible(false);
      viewModel.get("car_num").setVisible(false);
      viewModel.get("accompanying_peoples").setVisible(false);
      viewModel.get("trip_code").setVisible(false);
      viewModel.get("health_code").setVisible(false);
      viewModel.get("people_image").setVisible(false);
      viewModel.get("button24vd").setValue("关于访客信息");
    } else if (viewModel.get("button24vd").getValue() == "关于访客信息") {
      viewModel.get("vistor_name").setVisible(true);
      viewModel.get("phone").setVisible(true);
      viewModel.get("certificate_type").setVisible(true);
      viewModel.get("certificate_num").setVisible(true);
      viewModel.get("vistor_reason").setVisible(true);
      viewModel.get("appointment_time").setVisible(true);
      viewModel.get("effective_day").setVisible(true);
      viewModel.get("car_num").setVisible(true);
      viewModel.get("accompanying_peoples").setVisible(true);
      viewModel.get("trip_code").setVisible(true);
      viewModel.get("health_code").setVisible(true);
      viewModel.get("people_image").setVisible(true);
      viewModel.get("button24vd").setValue("员工必填信息");
    }
  });
//提交前
//用于详情页面
viewModel.on("beforeSubmit", function (args) {
  debugger;
  //获取表单数据
  let jsonStr = args.data.data;
  let data = JSON.parse(jsonStr);
  var judge = 0;
  var merror = "请填写必要信息：";
  if (data.vistor_name == undefined) {
    judge = 1;
    merror += "访客姓名、";
  }
  if (data.phone == undefined) {
    judge = 1;
    merror += "联系电话、";
  }
  if (data.certificate_type == undefined) {
    judge = 1;
    merror += "证件类型、";
  }
  if (data.certificate_num == undefined) {
    judge = 1;
    merror += "证件号码、";
  }
  if (data.vistor_reason == undefined) {
    judge = 1;
    merror += "访客事由、";
  }
  if (data.shebeifengzu_DeviceGroupName == undefined) {
    judge = 1;
    merror += "设备分组、";
  }
  if (data.appointment_time == undefined) {
    judge = 1;
    merror += "预约时间、";
  }
  if (data.effective_day == undefined) {
    judge = 1;
    merror += "有效天数、";
  }
  if (data.trip_code == undefined) {
    judge = 1;
    merror += "行程码、";
  }
  if (data.health_code == undefined) {
    judge = 1;
    merror += "健康码、";
  }
  if (data.people_image == undefined) {
    judge = 1;
    merror += "人脸照、";
  }
  if (judge == 1) {
    cb.utils.alert(merror);
    return false;
  }
});
viewModel.get("vistor_name") &&
  viewModel.get("vistor_name").on("afterValueChange", function (data) {
    // 访客姓名--值改变后
  });