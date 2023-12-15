let invokeFunction1 = function (id, data, callback, options) {
  var proxy = cb.rest.DynamicProxy.create({
    doProxy: {
      url: "/web/function/invoke/" + id,
      method: "POST",
      options: options
    }
  });
  proxy.doProxy(data, callback);
};
viewModel.get("interfaceFieldDownload") &&
  viewModel.get("interfaceFieldDownload").on("afterValueChange", function (data) {
    // 接口字段标识(下载)--值改变后
    viewModel.get("interfaceFieldUpload").setValue(data.value);
    viewModel.get("interfaceFieldImport").setValue(data.value);
    viewModel.get("fieldIdentification").setValue(data.value);
  });
viewModel.get("interfaceFieldName") &&
  viewModel.get("interfaceFieldName").on("afterValueChange", function (data) {
    // 接口字段名称--值改变后
    viewModel.get("fieldName").setValue(data.value);
    viewModel.get("fieldExplain").setValue(data.value);
  });
viewModel.on("beforeSave", function (params) {
  let interfaceFieldDownload = viewModel.get("interfaceFieldDownload").getValue();
  let returnPromise = new cb.promise();
  let ySql = "select id from ISVUDI.ISVUDI.sy01_country_interface_datav2 where interfaceFieldDownload = '" + interfaceFieldDownload + "'";
  invokeFunction1(
    "ISVUDI.publicFunction.shareApi",
    {
      sqlType: "check",
      sqlTableInfo: ySql,
      sqlCg: "sy01"
    },
    function (err, res) {
      if (err) {
        cb.utils.alert(err.message, "error");
        returnPromise.reject();
      } else {
        if (res.resDataRs.length > 0) {
          cb.utils.alert("当前字段标识:" + interfaceFieldDownload + "已存在,无法保存", "error");
          returnPromise.reject();
        } else {
          returnPromise.resolve();
        }
      }
    },
    {
      domainKey: "sy01"
    }
  );
  return returnPromise;
});
viewModel.on("customInit", function (data) {
  // 国家UDI接口数据模型列表详情--页面初始化
});