viewModel.get("button22tc") &&
  viewModel.get("button22tc").on("click", function (data) {
    //按钮--单击
    addSampleRecord(viewModel);
  });
// 后台调用
let doProxy = function (params, callback, data, viewmodel) {
  let proxy = null;
  if (viewmodel) {
    proxy = viewmodel.setProxy({
      doProxy: {
        url: params.cSvcUrl,
        method: params.cHttpMethod || "POST",
        options: params.options
      }
    });
  }
  if (params.options && params.options.async === false) {
    const result = proxy.doProxy(data);
    return callback(result.error, result.result);
  } else {
    proxy.doProxy(data, callback);
  }
};
const addSampleRecord = function (viewModel) {
  let params = {
    cSvcUrl: "/qms/qit/sample/record/addSampleRecord",
    cHttpMethod: "POST",
    options: { domainKey: "yourKeyHere", async: false }
  };
  let data = [
    // 单据
    {
      code: "CPJY202312080001",
      // 检验信息
      checkInfo: [
        {
          inspectItemCode: "C00001",
          // 样本信息
          sampleRecord: [
            {
              sampleCode: "10",
              inspectValue: "10"
            }
          ]
        }
      ]
    }
  ];
  let callback = (err, resp) => {
    if (err) {
      cb.utils.alert(err.message, "error");
      return;
    }
  };
  doProxy(params, callback, data, viewModel);
};