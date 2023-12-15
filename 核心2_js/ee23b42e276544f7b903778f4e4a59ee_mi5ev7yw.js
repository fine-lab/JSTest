viewModel.on("customInit", function (data) {
  var viewModel = this;
  //页面数据加载完毕
  debugger;
  viewModel.on("afterLoadData", function (data) {
    debugger;
    let manufacturerDate = viewModel.get("manufacturerDate").getValue();
    let manufacturerDate1 = getDate(manufacturerDate);
    viewModel.get("manufacturerDate").setValue(manufacturerDate1);
    let is_wanzhen = viewModel.get("is_wanzhen").getValue();
    if (is_wanzhen == "0") {
      // 设置字段显示
      viewModel.get("breakage").setState("visible", true);
      // 设置字段必填
      viewModel.get("breakage").setState("bIsNull", true);
    } else {
      // 设置字段隐藏
      viewModel.get("breakage").setState("visible", false);
      // 设置字段非必填
      viewModel.get("breakage").setState("bIsNull", false);
    }
    let is_shiwu = viewModel.get("is_shiwu").getValue();
    if (is_shiwu == "0") {
      // 设置字段显示
      viewModel.get("inconsistent").setState("visible", true);
      // 设置字段必填
      viewModel.get("inconsistent").setState("bIsNull", true);
    } else {
      // 设置字段隐藏
      viewModel.get("inconsistent").setState("visible", false);
      // 设置字段非必填
      viewModel.get("inconsistent").setState("bIsNull", false);
    }
    let validity = viewModel.get("validity").getValue();
    if (validity == "2") {
      // 设置字段显示
      viewModel.get("physicalphotos").setState("visible", true);
      // 设置字段必填
      viewModel.get("physicalphotos").setState("bIsNull", true);
    } else {
      // 设置字段隐藏
      viewModel.get("physicalphotos").setState("visible", false);
      // 设置字段非必填
      viewModel.get("physicalphotos").setState("bIsNull", false);
    }
    let yunshu_type = viewModel.get("yunshu_type").getValue();
    if (yunshu_type == "4") {
      // 设置字段显示
      viewModel.get("othertransportation").setState("visible", true);
      // 设置字段必填
      viewModel.get("othertransportation").setState("bIsNull", true);
    } else {
      // 设置字段隐藏
      viewModel.get("othertransportation").setState("visible", false);
      // 设置字段非必填
      viewModel.get("othertransportation").setState("bIsNull", false);
    }
  });
  function getDate(date) {
    if (date != undefined) {
      date = new Date(date);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      let dateTime = year + "-" + month + "-" + day;
      return dateTime;
    }
  }
});