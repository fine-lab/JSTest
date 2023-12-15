viewModel.on("beforeSearch", function (args) {
  //获取用户授权列表
  let result = cb.rest.invokeFunction("AT16AD797616380008.API.serachUserAuthor", {}, function (err, res) {}, viewModel, { async: false });
  var commonVOs = args.params.condition.commonVOs;
  commonVOs.push({
    itemName: "area",
    value1: result.result.res[0].area
  });
});