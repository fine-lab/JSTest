viewModel.getGridModel().on("beforeSetDataSource", (args) => {
  let medalList = [];
  var medalData = args;
  medalData.map((item) => {
    medalList.push(item.medal);
  });
  cb.rest.invokeFunction("AT165369EC09000003.apifunc.PP1670565968", { medalList }, function (err, res) {
    let serviceCode = "AT165369EC09000003";
    // 根据id 请求图片资源
    const proxy = cb.rest.DynamicProxy.create({
      getFileInfo: {
        url: "https://www.example.com/",
        method: "POST",
        options: { token: true, withCredentials: true }
      }
    });
    let batchFiles = [];
    let batchFile = {
      objectId: "",
      objectName: "iuap-yonbuilder-runtime+mdf"
    };
    res.medals.map((item) => {
      batchFile.objectId = "mdf_" + item.medal_img;
      batchFiles.push(batchFile);
    });
    batchFiles = JSON.stringify(batchFiles);
    proxy.getFileInfo(
      { pageSize: 10000, includeChild: false, batchFiles },
      function (err, result) {
        result.data.map((item1) => {
          res.medals.map((item2) => {
            if (item1.objectId === item2.medal_img) {
              item2.medal_img = item1.filePath;
            }
          });
        });
      },
      this
    );
    args.map((item1) => {
      medalData.map((item2) => {
        if (item1.medal === item2.id) {
          item1.medal_img = item2.medal_img;
        }
      });
    });
  });
  debugger;
  return medalData;
});