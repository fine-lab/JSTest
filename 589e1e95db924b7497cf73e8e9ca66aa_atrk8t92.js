viewModel.get("button18hb") &&
  viewModel.get("button18hb").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT15CCB82E16F00007.backDesignerFunction.A1548875", {}, function (err, res) {
      let fileServerUrl = window.__MDF_FILEURL__;
      let serviceCode = "AT15CCB82E16F00007";
      if (JSON.parse(res.res[0].tupian).fileID) {
        // 根据id 请求图片资源
        const fileUrl = cb.utils.getFileOperationUrl(fileServerUrl).info(JSON.parse(res.res[0].tupian).fileID);
        const proxy = cb.rest.DynamicProxy.create({
          getFileInfo: {
            url: "https://www.example.com/",
            method: "POST",
            options: { token: true, withCredentials: true }
          }
        });
        proxy.getFileInfo(
          { pageSize: 10000, includeChild: false, batchFiles: '[{"objectId":"mdf_65536540-7632-11ed-8e85-458f50ef6888","objectName":"iuap-yonbuilder-runtime+caep"}]' },
          function (err, result) {
            if (err || !result) return;
            if (result.filePath) {
              this.setState({ src: result.filePath }); // TODO: WJP 给静态图片赋值  setState('src', url)
            }
          },
          this
        );
      }
    });
  });
viewModel.on("customInit", function (data) {
});
viewModel.get("button22yi") && viewModel.get("button22yi").on("click", function (data) {});
viewModel.get("button22yj") &&
  viewModel.get("button22yj").on("click", function (data) {
    // 按钮2--单击
    cb.rest.invokeFunction("AT15CCB82E16F00007.backDesignerFunction.test1210002", {}, function (err, res) {});
  });