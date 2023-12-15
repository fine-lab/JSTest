viewModel.on("customInit", function (data) {
  debugger;
  viewModel.on("modeChange", function (data) {
    cb.utils.alert(data);
    debugger;
    if (data == "edit") {
      console.log("-----------------------------123");
    }
  });
  // 通用报销单--页面初始化
  cb.rest.invokeFunction2 = function (id, data, callback, viewModel, options) {
    if (!options) {
      var options = {};
    }
    options.domainKey = "yourKeyHere";
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    return proxy.doProxy(data, callback);
  };
  viewModel.get("btnSave").on("click", function (args) {
    cb.rest.invokeFunction2("RBSM.bz.savecheck", {}, function (err, res) {
      if (err) {
        alert(JSON.stringify(err));
      }
    });
  });
});