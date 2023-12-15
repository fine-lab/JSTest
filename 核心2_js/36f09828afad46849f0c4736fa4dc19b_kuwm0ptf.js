viewModel.on("beforeSearch", function (args) {
  var userid = cb.context.getUserId(); // 用户id
  console.log(userid);
  var paramarry = args.params.condition.commonVOs;
  paramarry.push({ itemName: "submitter_id", value1: userid });
});