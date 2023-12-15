viewModel.on("customInit", function (data) {
  //门店单卡--页面初始化
});
viewModel.on("afterLoadData", function (args) {
  //门店页面 -- 子页签加工处理
  let id = viewModel.get("id").getValue();
  debugger;
  if (id != undefined) {
    //获取订单页签
    let orderGridModle = viewModel.get("ordersonList");
    //调用订单函数数据
    let orderres = cb.rest.invokeFunction("AT19C60C3809D80006.API.getorderbyshop", { shopid: id }, function (err, res) {}, viewModel, { async: false });
    let orderarr = orderres.result.res;
    //将订单页签数据渲染到子表中
    orderGridModle.insertRows(1, orderarr);
    //用户页签
    let userres = cb.rest.invokeFunction("AT19C60C3809D80006.API.getuserbyshop", { shopid: id }, function (err, res) {}, viewModel, { async: false });
    let userGridModle = viewModel.get("usersonList");
    let userarr = userres.result.res;
    userGridModle.insertRows(1, userarr);
  }
});
viewModel.get("button17dj") &&
  viewModel.get("button17dj").on("click", function (data) {
    //门店页面模态框方式展示页面
    //获取店铺ID
    let id = viewModel.get("id").getValue();
    if (id != undefined) {
      //传递给被打开页面的数据信息
      let vdata = {
        billtype: "VoucherList", // 单据类型
        billno: "yb02245614", // 单据号
        params: {
          mode: "browse", // (编辑态edit、新增态add、浏览态browse)
          shopid: id //店铺id
        }
      };
      //打开一个模态框单据，并在当前页面显示
      cb.loader.runCommandLine("bill", vdata, viewModel);
    }
  });