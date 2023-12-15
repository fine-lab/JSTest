cb.rest.invokeFunctionS = function (id, data, callback, viewModel, options) {
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
viewModel.on("customInit", function (data) {
  //差旅费报销单列表--页面初始化
  if (cb.rest.AppContext.user.userId == "uspace_2897418") {
    cb.rest.invokeFunctionS("RBSM.backDesignerFunction.getFKdata", {}, function (err, res) {
      cb.utils.alert(err, "**************************error**************************");
      cb.utils.alert(res, "**************************res**************************");
    });
  }
});