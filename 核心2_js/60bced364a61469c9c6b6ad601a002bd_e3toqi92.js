viewModel.on("beforeSearch", function (args) {
  console.log();
  //获取当前登陆人id
  let userId = cb.context.getUserId();
  console.log(userId);
  //同步操作async: false
  let result = cb.rest.invokeFunction("AT19D3CA6A0868000B.backOpenApiFunction.selectXHYLFZ", { userId: userId }, function (err, res) {}, viewModel, { async: false });
  console.log(result);
  args.isExtend = true;
  //循环从后台脚本获取到的编码
  let fzarr = [];
  var temp = result.result.res;
  for (var i = 0; i < temp.length; i++) {
    var fz = temp[i].fenzubianma; //.getValue('fenzubianma')
    fzarr.push(fz);
  }
  //如果为空 就给它一个空字符串,什么都查不到
  if (temp.length === 0) {
    fzarr.push("");
  }
  //从列表过滤
  args.params.condition.simpleVOs = [
    {
      field: "xhylfenzubianma",
      op: "in",
      value1: fzarr
    }
  ];
});