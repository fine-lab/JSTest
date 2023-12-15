viewModel.on("customInit", function (data) {
  const r = viewModel.get("button20od");
  console.log("=============ssssssssssssss==================");
  console.log(r);
});
viewModel.get("progresssteps") &&
  viewModel.get("progresssteps").on("onStepChanged", function (data) {
    console.log("=============ssssssssssssss==================" + data);
  });
viewModel.get("button20od") &&
  viewModel.get("button20od").on("click", function (data) {
    // 工作通知--单击
    cb.rest.invokeFunction("AT16332D3A09880009.msg.noticemessage", {}, function (err, res) {
      if (err != null) throw new Error(err);
    });
  });
viewModel.get("button23li") &&
  viewModel.get("button23li").on("click", function (data) {
    // 代办消息--单击
    var parm = new Object();
    parm.id = viewModel.get("id").getValue();
    cb.rest.invokeFunction("AT16332D3A09880009.msg.todomessage", parm, function (err, res) {
      if (err != null) throw new Error(err);
      else console.log(res);
    });
  });