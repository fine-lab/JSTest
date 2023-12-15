viewModel.on("customInit", function (data) {
  viewModel.on("afterMount", function () {
    viewModel.getCache("FilterViewModel").getParams().filterRows = 3;
  });
  var btnVideo = viewModel.get("button2ig");
  var videourl = "";
  var GridModel = viewModel.get("isv_videolog_1563459063163912192");
  var domainKey = viewModel.getDomainKey();
  console.log(domainKey);
  cb.rest.invokeFunction(
    "9361fcb218c7492081e8551eb8c0c787",
    { domainKey: domainKey },
    function (err, res) {
      if (err != null && err != "") {
        cb.utils.alert("获取地址失败" + err);
        console.log(err);
        return;
      }
      console.log(res);
      videourl = res.config.videoUrl;
    },
    viewModel
  );
  btnVideo.on("click", function (args) {
    var currentRow = GridModel.getRow(args.index);
    if (currentRow.url == null || currentRow.url == undefined || currentRow.url == "") {
      cb.utils.alert("视频文件不存在");
      return;
    }
    var url = "http://" + videourl + currentRow.url;
    console.log(url);
    window.open(url);
  });
});
viewModel.get("button2ig") && viewModel.get("button2ig").on("click", function (data) {});