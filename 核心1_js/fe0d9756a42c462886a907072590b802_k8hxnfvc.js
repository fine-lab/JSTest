viewModel.on("customInit", function (data) {});
// 通用报销单--页面初始化
var userIds = [];
userIds.push("ea764084-6c48-43b7-8ba7-62a47a767034");
userIds.push("6997dbd1-6600-43bd-99ee-55b48b4fc484");
userIds.push("3350a06d-879f-44da-928b-e9062a4441fc");
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