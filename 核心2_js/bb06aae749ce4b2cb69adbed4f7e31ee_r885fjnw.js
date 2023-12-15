viewModel.on("customInit", function (data) {
  // 事件推送--页面初始化
  let body = {
    signature: "cs0412",
    timestamp: "123123",
    nonce: "112233",
    companyid: "youridHere",
    appid: "youridHere",
    eventkey: "yourkeyHere",
    eventid: "youridHere",
    eventtime: "147258369"
  };
  cb.rest.invokeFunction("094a60fd1604437484a8e459d54400da", { body: body }, function (err, res) {
    console.log(res, "resssssss");
    console.log(err, "errrrrrrr");
  });
});