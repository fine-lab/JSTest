viewModel.on("customInit", function (data) {
  // 外包资源预提单详情--页面初始化
  function formatDate(date) {
    var month = date.getMonth() + 1;
    return date.getFullYear() + "-" + month + "-" + date.getDate();
  }
  function formatMonth() {
    var date = new Date();
    var month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    return month;
  }
  viewModel.on("afterLoadData", function () {
    //当前页面状态
    var currentState = viewModel.getParams().mode; //add:新增态，edit:编辑态, browse:浏览态
    var verifystate = viewModel.get("verifystate").getValue();
    if (currentState == "add") {
      //新增状态
      viewModel.get("billDate").setValue(formatDate(new Date()));
      let billName = "外包资源预提单-" + formatMonth() + "月";
      viewModel.get("billName").setValue(billName);
      let subject =
        '<p style="text-align:center;" size="0" _root="youridHere" __ownerid="youridHere" __hash="youridHere" __altered="false"><strong><span style="font-size:20px">' + billName + "</span></strong></p>";
      viewModel.get("item60ah").setValue(subject);
      //主组织默认值
      let staffRes = cb.rest.invokeFunction("GT5258AT16.pubFunction.getStaffByUserId", { userId: cb.rest.AppContext.user.userId }, function (err, res) {}, viewModel, { async: false });
      let staff = staffRes.result;
      if (staff && staff.code === "200" && staff.data && staff.data.data && staff.data.data.length > 0) {
        let staffData = staff.data.data[0];
        viewModel.get("org_id").setValue(staffData.org_id);
        viewModel.get("org_id_name").setValue(staffData.org_id_name);
        viewModel.get("orgName").setValue(staffData.org_id_name);
        viewModel.get("linkman").setValue(staffData.id);
        viewModel.get("linkman_name").setValue(staffData.name);
        if (staffData.mobile) {
          viewModel.get("mobile").setValue(staffData.mobile.split("-")[1]);
        }
      }
      if (cb.rest.AppContext.user.userId == "ea764084-6c48-43b7-8ba7-62a47a767034") {
        addPartners();
      }
    }
  });
  viewModel.on("modeChange", function (data) {
    setButonStatus(data);
  });
  function setButonStatus(currentState) {
    var userids = [];
    userids.push("7744868c-4c53-454f-a765-c39d90355032"); //高峰成
    userids.push("15dbab5c-e734-4773-95a8-e739acc6bb54"); //许冕
    userids.push("ea764084-6c48-43b7-8ba7-62a47a767034"); //林杰
    userids.push("58bb83cd-37ad-49ec-bf0b-078de2389cf4"); //陈曦
    userids.push("13b0037f-f6c6-47b2-8d79-d7a14859d096"); //刘浩
    userids.push("a689e889-ea13-416d-be96-21b0e706fe2c"); //刘磊
    userids.push("c7526239-1898-49e9-bd27-309bfb154e4d"); //王晨伟
    userids.push("e86182ae-8410-4ac9-bd78-f088291c3cf7"); //刘明宇
    userids.push("2c0a5807-306b-4dd1-b9b6-82ae93df8d0b"); //胡丹蓓
    userids.push("1a4d16ea-9c04-4377-aaaf-8b489da17bf7"); //王雪鹏
    userids.push("5fe40134-a287-4f90-bb74-57ef419a8114"); //袁毅
    if (currentState == "add" || currentState == "edit") {
      viewModel.get("button82ah").setVisible(false);
      viewModel.get("button71ek").setVisible(false);
      viewModel.get("button122gf").setVisible(false);
      viewModel.get("dropdownbutton32qh").setVisible(false);
      viewModel.get("button109jh").setVisible(false);
      viewModel.get("button133vd").setVisible(false);
      viewModel.get("button148nh").setVisible(false);
      viewModel.get("button162fj").setVisible(false);
    } else {
      viewModel.get("button82ah").setVisible(true);
      viewModel.get("button122gf").setVisible(true);
      viewModel.get("button71ek").setVisible(false);
      viewModel.get("dropdownbutton32qh").setVisible(false);
      viewModel.get("button109jh").setVisible(false);
      viewModel.get("button133vd").setVisible(false);
      viewModel.get("button148nh").setVisible(false);
      viewModel.get("button162fj").setVisible(false);
      if (userids.includes(cb.rest.AppContext.user.userId)) {
        viewModel.get("button71ek").setVisible(true);
        viewModel.get("dropdownbutton32qh").setVisible(true);
        viewModel.get("button109jh").setVisible(true);
        viewModel.get("button133vd").setVisible(true);
        viewModel.get("button148nh").setVisible(true);
        viewModel.get("button162fj").setVisible(true);
      }
    }
  }
  function addPartners() {
    //查询默认伙伴
    cb.rest.invokeFunction("GT5258AT16.contacts.queryGDContact", { platform: "1" }, function (err, res) {
      debugger;
      console.log(res);
      var gridModel = viewModel.getGridModel();
      if (res && res.links && res.links.length > 0) {
        var links = res.links;
        for (var a1 = 0; a1 < links.length; a1++) {
          var link = links[a1];
          var partner1 = {
            responseStatus: "1",
            hasDefaultInit: true,
            _tableDisplayOutlineAll: false,
            linkMan_name: link.contractName,
            linkMan: link.contact,
            linkManName: link.contractName,
            linkManEmail: link.email,
            yhtUserid: link.yhtUserId,
            partner: link.partner,
            partner_name: link.partnerName,
            partnerName: link.partnerName,
            isPublic: "N"
          };
          gridModel.appendRow(partner1);
        }
      }
    });
  }
  viewModel.get("linkman_name").on("afterReferOkClick", function (data) {
    //参照选择的数据
    if (data && data.length > 0 && data[0].mobile) {
      viewModel.get("mobile").setValue(data[0].mobile.split("-")[1]);
    }
  });
});
//行业
viewModel.get("apply_outs_resource_industryList") &&
  viewModel.get("apply_outs_resource_industryList").on("afterValueChange", function (data) {
    var indList = viewModel.get("apply_outs_resource_industryList").getShowValue();
    var industryArray = [];
    for (var indi = 0; indi < indList.length; indi++) {
      industryArray.push(indList[indi].apply_outs_resource_industryList);
    }
    viewModel.get("industryName").setValue(industryArray.join(","));
  });
// 领域
viewModel.get("apply_outs_resource_reqFieldNewList") &&
  viewModel.get("apply_outs_resource_reqFieldNewList").on("afterValueChange", function (data) {
    var fieldList = viewModel.get("apply_outs_resource_reqFieldNewList").getShowValue();
    var fieldArray = [];
    for (var fi = 0; fi < fieldList.length; fi++) {
      fieldArray.push(fieldList[fi].apply_outs_resource_reqFieldNewList);
    }
    viewModel.get("reqFieldNewName").setValue(fieldArray.join(","));
  });
function getDeliveryTypeNames(deliveryTypes) {
  var names = [];
  for (var di = 0; di < deliveryTypes.length; di++) {
    if (deliveryTypes[di] == "1") {
      names.push("实施");
    }
    if (deliveryTypes[di] == "2") {
      names.push("客开");
    }
    if (deliveryTypes[di] == "3") {
      names.push("咨询");
    }
    if (deliveryTypes[di] == "4") {
      names.push("运维");
    }
  }
  return names.join(",");
}
// 交付类型
viewModel.get("deliveryTypes") &&
  viewModel.get("deliveryTypes").on("afterValueChange", function (data) {
    var deliveryTypeNames = getDeliveryTypeNames(viewModel.get("deliveryTypes").getValue());
    viewModel.get("deliveryTypeNames").setValue(deliveryTypeNames);
  });
function getPrductPlatformNames(prductPlatform) {
  var names = [];
  for (var di = 0; di < prductPlatform.length; di++) {
    if (prductPlatform[di] == "1") {
      names.push("YonBIP旗舰版");
    }
    if (prductPlatform[di] == "2") {
      names.push("NCCloud");
    }
    if (prductPlatform[di] == "3") {
      names.push("iuap云平台");
    }
    if (prductPlatform[di] == "4") {
      names.push("行业产品");
    }
    if (prductPlatform[di] == "5") {
      names.push("移动应用开发");
    }
    if (prductPlatform[di] == "6") {
      names.push("YonBIP高级版");
    }
  }
  return names.join(",");
}
// 产品平台
viewModel.get("prductPlatform") &&
  viewModel.get("prductPlatform").on("afterValueChange", function (data) {
    debugger;
    var prductPlatformNames = getPrductPlatformNames(viewModel.get("prductPlatform").getValue());
    viewModel.get("prductPlatformNames").setValue(prductPlatformNames);
  });
//终止
viewModel.get("button82ah") &&
  viewModel.get("button82ah").on("click", function (data) {
    // 终止--单击
    var id = viewModel.get("id").getValue();
    cb.utils.confirm(
      "终止后将无法发布伙伴，并且伙伴也无法进行响应，确认继续终止？",
      function () {
        let res = cb.rest.invokeFunction("GT5258AT16.wbzyytd.terminateWBYTD", { id }, function (err, res) {}, viewModel, { async: false });
        console.log(res);
        cb.utils.alert("终止完成！");
        viewModel.execute("refresh");
      },
      function (args) {}
    );
  });
//激活
viewModel.get("button122gf") &&
  viewModel.get("button122gf").on("click", function (data) {
    // 终止--单击
    var id = viewModel.get("id").getValue();
    var isClose = viewModel.get("isClose").getValue();
    if (isClose !== "Y") {
      cb.utils.alert("该单据未终止，不需要激活！");
      return;
    }
    cb.utils.confirm(
      "确认继续激活？",
      function () {
        let res = cb.rest.invokeFunction("GT5258AT16.wbzyytd.recoverWBYTD", { id }, function (err, res) {}, viewModel, { async: false });
        console.log(res);
        cb.utils.alert("激活完成！");
        viewModel.execute("refresh");
      },
      function (args) {}
    );
  });
//发布伙伴
viewModel.get("button71ek") &&
  viewModel.get("button71ek").on("click", function (data) {
    // 发布伙伴--单击
    var id = viewModel.get("id").getValue();
    var isClose = viewModel.get("isClose").getValue();
    if (isClose == "Y") {
      cb.utils.alert("该单据已终止，无法发布！");
      return;
    }
    cb.utils.confirm(
      "确认发布伙伴？发布后请耐心等待，请勿在短时间内多次重复发布！",
      function () {
        //生成反馈单
        cb.rest.invokeFunction("GT5258AT16.wbzyytd.generateFKD", { id, isMobile: false }, function (err, res) {
          console.log(res);
          cb.utils.alert("发布完成！");
          viewModel.execute("refresh");
        });
      },
      function (args) {}
    );
  });
//保存后增加默认伙伴
viewModel.on("afterSave", function (args) {
  debugger;
  var id = viewModel.get("id").getValue();
  let res = cb.rest.invokeFunction("GT5258AT16.wbzyytd.addPartnerInfo", { id }, function (err, res) {}, viewModel, { async: false });
  console.log(res);
  viewModel.execute("refresh");
});
//提交后事件
viewModel.on("afterSubmit", function (args) {
  debugger;
  var id = viewModel.get("id").getValue();
  //移动应用：提交即生成反馈单
  let res = cb.rest.invokeFunction("GT5258AT16.wbzyytd.generateFKD", { id, isMobile: true }, function (err, res) {}, viewModel, { async: false });
  console.log("提交后事件", res);
  viewModel.execute("refresh");
});
viewModel.get("button92de") &&
  viewModel.get("button92de").on("click", function (data) {
    // 保存并提交--单击
  });
// 增加伙伴方案--所有金牌伙伴
viewModel.get("button109jh") &&
  viewModel.get("button109jh").on("click", function (data) {
    var id = viewModel.get("id").getValue();
    let res = cb.rest.invokeFunction("GT5258AT16.wbzyytd.addGoldPartner", { id, level: "00502" }, function (err, res) {}, viewModel, { async: false });
    cb.utils.alert("增加完成！");
    viewModel.execute("refresh");
  });
// 增加伙伴方案--所有银牌伙伴
viewModel.get("button133vd") &&
  viewModel.get("button133vd").on("click", function (data) {
    var id = viewModel.get("id").getValue();
    let res = cb.rest.invokeFunction("GT5258AT16.wbzyytd.addGoldPartner", { id, level: "00503" }, function (err, res) {}, viewModel, { async: false });
    cb.utils.alert("增加完成！");
    viewModel.execute("refresh");
  });
// 增加伙伴方案--所有铜牌伙伴
viewModel.get("button148nh") &&
  viewModel.get("button148nh").on("click", function (data) {
    var id = viewModel.get("id").getValue();
    let res = cb.rest.invokeFunction("GT5258AT16.wbzyytd.addGoldPartner", { id, level: "00504" }, function (err, res) {}, viewModel, { async: false });
    cb.utils.alert("增加完成！");
    viewModel.execute("refresh");
  });
// 增加伙伴方案--所有钻石伙伴
viewModel.get("button162fj") &&
  viewModel.get("button162fj").on("click", function (data) {
    // 所有钻石伙伴--单击
    var id = viewModel.get("id").getValue();
    let res = cb.rest.invokeFunction("GT5258AT16.wbzyytd.addGoldPartner", { id, level: "00501" }, function (err, res) {}, viewModel, { async: false });
    cb.utils.alert("增加完成！");
    viewModel.execute("refresh");
  });