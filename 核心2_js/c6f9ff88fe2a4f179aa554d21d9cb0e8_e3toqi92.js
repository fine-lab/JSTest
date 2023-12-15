viewModel.on("afterSave", function (args) {
  //行数据
  let updateline = viewModel.getGridModel().getData();
  // 主表数据
  let hexiaodan = args.res;
  console.log(args.res.xhylshoukuandan);
  let result = cb.rest.invokeFunction("AT19D3CA6A0868000B.backOpenApiFunction.updatefapiaohang", { updateline: updateline, hexiaodan: hexiaodan }, function (err, res) {}, viewModel, { async: false });
  console.log(result);
  args.isExtend = true;
});