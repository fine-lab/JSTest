viewModel.on("customInit", function (data) {
  //后端自动控制--页面初始化
  function refresh() {
    viewModel.execute("refresh");
  }
  let mytime = setInterval(() => {
    refresh();
  }, 10000);
  function log(msg) {
    let nmsg = msg;
    let bizFlowId = "yourIdHere";
    let bizFlowInstanceId = "yourIdHere";
    let queen = "";
    if (!!bizFlowId && !!bizFlowInstanceId) {
      queen += bizFlowId;
    } else {
      queen += "hellword";
    }
    let type = typeof msg;
    if (type == "string") {
      if (!!bizFlowInstanceId) {
        nmsg = "\n" + bizFlowInstanceId + ":\n" + nmsg;
      }
    } else {
      let outmsg = JSON.stringify(msg);
      if (!!bizFlowInstanceId) {
        nmsg = "\n" + bizFlowInstanceId + ":\n" + outmsg;
      } else {
        nmsg = outmsg;
      }
    }
    cb.rest.invokeFunction("GT9912AT31.common.logQueen", { msg: nmsg, queen }, function (err, res) {});
  }
});