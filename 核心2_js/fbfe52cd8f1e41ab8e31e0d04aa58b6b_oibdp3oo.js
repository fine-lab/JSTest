viewModel.get("button22di") &&
  viewModel.get("button22di").on("click", function (data) {
    //乡镇信息同步--单击
    var sss = new Date();
    var y = sss.getFullYear();
    var m = sss.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = sss.getDate();
    d = d < 10 ? "0" + d : d;
    var riqi = y + "-" + m + "-" + d;
    console.log(riqi);
    cb.rest.invokeFunction("AT16388E3408680009.Custom.Town", { r: riqi }, function (err, res) {
      console.log(err);
      console.log(res);
    });
  });