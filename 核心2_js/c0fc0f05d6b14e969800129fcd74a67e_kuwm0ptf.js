viewModel.get("AttachmentList").on("cellJointQuery", function (args) {
  debugger;
  if (args.cellName == "lookfj") {
    //预览
    window.open(args.row.lookfj, "_blank", "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes");
  }
  if (args.cellName == "DownUrl") {
    //下载
    const iframe = document.createElement("iframe");
    iframe.setAttribute("hidden", "hidden");
    document.body.appendChild(iframe);
    iframe.onload = () => {
      if (iframe) {
        iframe.setAttribute("src", "about:blank");
      }
    };
    let url = args.row.DownUrl;
    iframe.setAttribute("src", url);
  }
});
viewModel.get("button11bk") &&
  viewModel.get("button11bk").on("click", function (data) {
    //撤回按钮
    debugger;
    var now = new Date();
    var year = now.getFullYear(); //获取完整的年份(4位,1970-????)
    var month = now.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var day = now.getDate(); //获取当前日(1-31)
    var hour = now.getHours(); //获取当前小时数(0-23)
    var minute = now.getMinutes(); //获取当前分钟数(0-59)
    var second = now.getSeconds(); //获取当前秒数(0-59)
    var time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    var ticket_id = viewModel.get("ticket_id").getValue();
    var rowid = viewModel.get("id").getValue();
    var userid = cb.context.getUserId();
    let result = cb.rest.invokeFunction("AT17FC00DA0848000A.api.getuser", { userid: userid }, function (err, res) {}, viewModel, { async: false });
    var user = result.result.res.res[0];
    var userName = user.name;
    var content = viewModel.get("content").getValue();
    var clremail = user.email;
    var clripone = user.mobile;
    var handler_id = viewModel.get("handler_id").getValue();
    var isnoflag = "0";
    if (content == undefined) {
      cb.utils.alert({
        title: "回复内容是必填项",
        type: "warning",
        duration: "3",
        mask: true,
        onClose: function () {}
      });
      return "";
    }
    cb.rest.invokeFunction(
      "AT17FC00DA0848000A.api.wdrawupdata",
      { rowid: rowid, clrname: userName, clremail: clremail, clripone: clripone, ticket_id: ticket_id, time: time, content: content },
      function (err, res) {
        console.log(res);
        cb.rest.invokeFunction("AT17FC00DA0848000A.api.ykjsend", { userid: handler_id, userName: userName, ticket_id: ticket_id, isnoflag: isnoflag }, function (err, res) {
          console.log(res);
        });
        cb.utils.alert({
          title: "撤回成功!",
          type: "success",
          duration: "3",
          mask: true,
          onClose: function () {}
        });
        viewModel.communication({ type: "return" });
      }
    );
  });