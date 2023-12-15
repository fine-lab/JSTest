viewModel.on("customInit", function (data) {
  var viewModel = this;
  setTimeout(function () {
    viewModel.on("beforeUnaudit", function (args) {
      var returnPromise = new cb.promise();
      //科园已经抓取
      var define21Obj = viewModel.get("headItem!define21"); //抓取状态
      var define22Obj = viewModel.get("headItem!define22"); //抓取时间
      var define2Obj = viewModel.get("headItem!define2"); //法律实体
      if (define21Obj === undefined || define22Obj === undefined || define2Obj === undefined) {
        console.log("销售订单弃审：没有值");
        return returnPromise.resolve();
      }
      var define2 = define2Obj.getValue();
      if (define2 === "科园") {
        var define21 = define21Obj.getValue();
        var define22 = define22Obj.getValue();
        console.log("销售订单弃审：define21状态：" + define21);
        console.log("销售订单弃审：define22时间：" + define22);
        if (define21 == "已抓取") {
          var msgStr = "科园已于[" + define22 + "]抓取销售订单，确定要继续弃审吗？";
          cb.utils.confirm(
            msgStr,
            function () {
              console.log("销售订单弃审：用户点击了确认弃审");
              cb.utils.alert("您已弃审科园销售订单，请及时通知科园协同处理");
              return returnPromise.resolve();
            },
            function () {
              console.log("销售订单弃审：用户点击了取消");
              return returnPromise.reject();
            }
          );
        } else {
          var msgStr = "科园销售订单，当前未标记抓取，确定要继续弃审吗？";
          cb.utils.confirm(
            msgStr,
            function () {
              console.log("销售订单弃审：未抓取用户点击了确认弃审");
              return returnPromise.resolve();
            },
            function () {
              console.log("销售订单弃审：未抓取用户点击了取消");
              return returnPromise.reject();
            }
          );
        }
      } else {
        console.log("销售订单弃审：非科园");
        return returnPromise.resolve();
      }
      console.log(returnPromise);
      return returnPromise;
    });
    viewModel.on("afterUnaudit", function (args) {
      viewModel.execute("refresh");
    });
  }, 10);
});