viewModel.get("button82hj") &&
  viewModel.get("button82hj").on("click", function (data) {
    // 重传--单击
    let tongBuZhuangTai = viewModel.get("tongBuZhuangTai").getValue();
    if (tongBuZhuangTai == true) {
      cb.utils.alert("温馨提示，客户档案信息已同步不能传递！" + tongBuZhuangTai, "info");
      return;
    } else {
      let id = viewModel.get("id").getValue();
      if (id == null || id == "") {
        cb.utils.alert("温馨提示，新增单据就不要重传了！", "info");
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
      cb.rest.invokeFunction("GT3734AT5.APIFunc.synStaffToCrmApi", { businessId: id }, function (err, res) {
        debugger;
        if (err == null) {
          console.log("res=" + res);
          var rst = res.rst;
          if (rst) {
            cb.utils.alert("温馨提示！同步档案已生成[" + res.customerId + "]", "info");
          } else {
            cb.utils.alert("温馨提示！同步档案生成失败[" + res.msg + "]", "error");
          }
        } else {
          cb.utils.alert("温馨提示！同步档案生成失败", "error");
        }
      });
    }
  });
viewModel.get("button36gg") &&
  viewModel.get("button36gg").on("click", function (data) {
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
    cb.rest.invokeFunction("GT3734AT5.APIFunc.getCustFromFTApi", { custCode: code, custId: custId }, function (err, res) {
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
    });
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