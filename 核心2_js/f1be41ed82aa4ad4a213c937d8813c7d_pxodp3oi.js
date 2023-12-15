viewModel.on("afterLoadData", function (data) {
  setCommLogVisible("f19d9ea2052247539aab564ffeafadc2");
  let tongBuZhuangTai = viewModel.get("tongBuZhuangTai").getValue();
  if (tongBuZhuangTai) {
    viewModel.get("shiBaiYuanYin").setState("cShowCaption", "富通客户ID");
    viewModel.get("button103jb").setVisible(true); //删除富通关联客户
    viewModel.get("button42fd").setVisible(true); //拉取信息进行同步
  } else {
    viewModel.get("shiBaiYuanYin").setState("cShowCaption", "失败原因");
    viewModel.get("button103jb").setVisible(false); //删除富通关联客户
    viewModel.get("button42fd").setVisible(false); //拉取信息进行同步
  }
  let isRelated = viewModel.get("isRelated").getValue(); //是否已生成系统档案
  viewModel.get("button72yf").setVisible(!tongBuZhuangTai); //重传
  let id = viewModel.get("id").getValue();
  if (id == undefined || id == "") {
    viewModel.get("button72yf").setVisible(false);
  }
  let resurgent_name = viewModel.get("resurgent_name").getValue();
  if (resurgent_name) {
    viewModel.get("resurgent_name").setVisible(true);
  } else {
    viewModel.get("resurgent_name").setVisible(false);
  }
});
viewModel.get("button118ge") &&
  viewModel.get("button118ge").on("click", function (data) {
    //生成系统档案--废弃（从系统客户档案生成）
    let isRelated = viewModel.get("isRelated").getValue();
    let merchant = viewModel.get("merchant").getValue();
    if (isRelated && merchant != null && merchant != "") {
      cb.utils.alert("温馨提示，系统客户档案已生成,不能重复生成！", "error");
      return;
    }
    let id = viewModel.get("id").getValue();
    let code = viewModel.get("code").getValue();
    let MingChen = viewModel.get("MingChen").getValue();
    let merchant_name = viewModel.get("merchant_name").getValue();
    if (id == null || id == "") {
      cb.utils.alert("温馨提示，请先完善信息！", "error");
      return;
    }
    cb.rest.invokeFunction("GT3734AT5.APIFunc.ApiCreateSysCust", { id: id, code: code, MingChen: MingChen, merchant_name: merchant_name }, function (err, res) {
      if (err == null) {
        var rst = res.rst;
        if (rst) {
          cb.utils.alert("温馨提示！系统客户档案已生成[" + res.custCode + "]", "info");
        } else {
          cb.utils.alert("温馨提示！系统客户档案生成失败[" + res.msg + "]", "error");
        }
      } else {
        cb.utils.alert("温馨提示！系统客户档案生成失败" + err, "error");
      }
      viewModel.execute("refresh"); //刷新单据信息
    });
  });
viewModel.get("button72yf") &&
  viewModel.get("button72yf").on("click", function (data) {
    // 重传--单击
    let tongBuZhuangTai = viewModel.get("tongBuZhuangTai").getValue();
    if (tongBuZhuangTai) {
      cb.utils.alert("温馨提示，客户档案信息已同步不能传递！" + tongBuZhuangTai, "info");
      return;
    } else {
      let id = viewModel.get("XunPanXXId").getValue();
      if (id == null || id == "") {
        cb.utils.alert("温馨提示，新增客户或期初导入客户就不能重传！", "info");
        return;
      }
      let tongBuShiiJan = viewModel.get("tongBuShiiJan").getValue();
      if (tongBuShiiJan != null && tongBuShiiJan != "") {
        let nowTime = new Date().getTime();
        let lastTime = new Date(tongBuShiiJan).getTime();
        if (nowTime - lastTime < 60 * 1000) {
          cb.utils.alert("温馨提示，你不能频繁提交，等会儿再提交吧！", "info");
          return;
        }
      }
      cb.rest.invokeFunction("GT3734AT5.APIFunc.synStaffToCrmApi", { businessId: id, orgName: viewModel.get("org_id_name").getValue(), billNo: viewModel.getParams().billNo }, function (err, res) {
        if (err == null) {
          var rst = res.rst;
          if (rst) {
            cb.utils.alert("温馨提示！同步档案已生成[" + res.msg + "]", "info");
          } else {
            cb.utils.alert("温馨提示！同步档案生成失败[" + res.msg + "]", "error");
          }
        } else {
          cb.utils.alert("温馨提示！同步档案生成失败", "error");
        }
        viewModel.execute("refresh"); //刷新单据信息
      });
    }
  });
viewModel.get("button42fd") &&
  viewModel.get("button42fd").on("click", function (data) {
    // 拉取客户信息-从富通更新--单击
    let laquShiJian = viewModel.get("laquShiJian").getValue();
    if (laquShiJian != null && laquShiJian != "") {
      let nowTime = new Date().getTime();
      let lastTime = new Date(laquShiJian).getTime();
      if (nowTime - lastTime < 60 * 1000) {
        cb.utils.alert("温馨提示，你不能频繁提交，等会儿再提交吧！", "info");
        return;
      }
    }
    let nowTimeStr = getNowDate();
    viewModel.get("laquShiJian").setValue(nowTimeStr);
    let tongBuZhuangTai = viewModel.get("tongBuZhuangTai").getValue();
    if (!tongBuZhuangTai) {
      cb.utils.alert("温馨提示，尚未同步不能拉取客户！", "info");
      return;
    }
    let code = viewModel.get("code").getValue();
    let custId = viewModel.get("id").getValue();
    cb.rest.invokeFunction(
      "GT3734AT5.APIFunc.getCustFromFTApi",
      { custCode: code, custId: custId, orgName: viewModel.get("org_id_name").getValue(), billNo: viewModel.getParams().billNo },
      function (err, res) {
        debugger;
        if (err == null) {
          console.log("res=" + res);
          var rst = res.rst;
          if (rst) {
            cb.utils.alert("温馨提示！同步客户档案成功!", "info");
          } else {
            cb.utils.alert("温馨提示！同步客户档案", "error");
          }
          viewModel.execute("refresh"); //刷新单据信息
        } else {
          cb.utils.alert("温馨提示！同步客户档案失败", "error");
        }
      }
    );
  });
viewModel.get("button103jb") &&
  viewModel.get("button103jb").on("click", function (data) {
    // 删除富通客户--单击
    let tongBuZhuangTai = viewModel.get("tongBuZhuangTai").getValue();
    if (!tongBuZhuangTai) {
      cb.utils.alert("尚未同步富通，不用此删除操作!", "info");
      return;
    }
    let ftid = viewModel.get("shiBaiYuanYin").getValue();
    let custId = viewModel.get("id").getValue();
    cb.utils.confirm(
      "确定要删除富通客户档案吗？删除后无法恢复,请慎重操作!",
      function () {
        cb.rest.invokeFunction(
          "GT3734AT5.APIFunc.delCustFromFTApi",
          { ftid: ftid, custId: custId, orgName: viewModel.get("org_id_name").getValue(), billNo: viewModel.getParams().billNo },
          function (err, res) {
            if (err == null) {
              var rst = res.rst;
              if (rst) {
                cb.utils.alert("温馨提示！删除富通客户档案成功!", "info");
                viewModel.execute("refresh"); //刷新单据信息
              } else {
                cb.utils.alert("温馨提示！删除富通客户档案失败[" + res.msg + "]", "error");
              }
            } else {
              cb.utils.alert("温馨提示！删除档案异常", "error");
            }
          }
        );
      },
      function (args) {}
    );
  });
const getNowDate = () => {
  let date = new Date();
  let sign2 = ":";
  let year = date.getFullYear(); // 年
  let month = date.getMonth() + 1; // 月
  let day = date.getDate(); // 日
  let hour = date.getHours(); // 时
  let minutes = date.getMinutes(); // 分
  let seconds = date.getSeconds(); //秒
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  hour = hour + 8 >= 24 ? hour + 8 - 24 : hour + 8;
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
};
const setCommLogVisible = (contentCode) => {
  let user = cb.rest.AppContext.user;
  let userName = user.userName;
  let isVisible = false;
  if (userName == "王西亚" || userName == "闫富森" || userName == "gole" || userName == "刘涵") {
    isVisible = true;
  }
  viewModel.execute("updateViewMeta", { code: contentCode, visible: isVisible });
};