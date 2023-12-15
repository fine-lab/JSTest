viewModel.get("button19gf") &&
  viewModel.get("button19gf").on("click", function (data) {
    // 派发--单击
    let newdata = {};
    let data2 = viewModel.getAllData();
    let date = new Date().format("yyyy-MM-dd hh:mm:ss");
    newdata["data2"] = data2;
    newdata["date"] = date;
    //派发后端API
    cb.rest.invokeFunction("AT165369EC09000003.DeptBudget.DistributionAPI", { newdata }, function (err, res) {
      if (res.code != "200") {
        cb.utils.alert(res.message, "error");
      } else {
        cb.utils.alert("派发成功", "success");
        cb.loader.runCommandLine(
          "bill",
          {
            billtype: "voucherList",
            billno: "6117c746List",
            params: {
              perData: "测试父页面数据传递"
            }
          },
          viewModel
        );
      }
    });
  });
//生效月份修改
var date;
var this_month;
var this_year;
var next_month;
var next_year;
viewModel.on("customInit", function (data) {
  debugger;
  date = new Date();
  this_month = date.getMonth() + 1;
  this_year = date.getFullYear();
  next_month = this_month == 12 ? 1 : this_month + 1;
  next_year = this_month == 12 ? this_year + 1 : this_year;
  viewModel.get("month").setValue(this_month);
  viewModel.get("year").setValue(this_year);
});
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 组织--值改变后
    debugger;
    if (!viewModel.get("month").getValue()) {
      viewModel.get("month").setValue(this_month);
      viewModel.get("year").setValue(this_year);
    }
  });
viewModel.get("item59bd").on("afterValueChange", function (data) {
  // 生效月份--值改变后
  if (viewModel.get("item59bd").getValue() == "1") {
    viewModel.get("month").setValue(this_month);
    viewModel.get("year").setValue(this_year);
  } else {
    viewModel.get("month").setValue(next_month);
    viewModel.get("year").setValue(next_year);
  }
});