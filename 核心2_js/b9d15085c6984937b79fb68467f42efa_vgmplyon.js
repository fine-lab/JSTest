viewModel.get("1671777430172_13").on("click", (data) => {
  mtl.scanQRCode({
    scanType: ["qrCode", "barCode"],
    needResult: 1,
    success: function (res) {
      var result = res.resultStr;
      let result_copy = JSON.parse(result);
      let rowIndex = viewModel.getGridModel("chukumingxiList").getFocusedRowIndex();
      viewModel.getGridModel("chukumingxiList").setCellValue(rowIndex, "caigoudingdanpo", result_copy.danhaopo);
      viewModel.getGridModel("chukumingxiList").setCellValue(rowIndex, "wuliaobianma_id", result_copy.wuliao);
      viewModel.getGridModel("chukumingxiList").setCellValue(rowIndex, "wuliaomingchen", result_copy.wuliaomingchen);
      viewModel.getGridModel("chukumingxiList").setCellValue(rowIndex, "guige", result_copy.wuliaoguige);
      viewModel.getGridModel("chukumingxiList").setCellValue(rowIndex, "waixiangxinghao", result_copy.waixiangxinghao);
      viewModel.getGridModel("chukumingxiList").setCellValue(rowIndex, "xiangzileibie", result_copy.xiangzileixing);
      viewModel.getGridModel("chukumingxiList").setCellValue(rowIndex, "naxiangxinghao", result_copy.naxiangxinghao);
      viewModel.getGridModel("chukumingxiList").setCellValue(rowIndex, "wuliaodanjia", result_copy.wuliaodanjia);
      viewModel.getGridModel("chukumingxiList").setCellValue(rowIndex, "gongyingshang_name", result_copy.xiangzileixing);
      viewModel.getGridModel("chukumingxiList").setCellValue(rowIndex, "new18", result_copy.youxiaoqi);
      viewModel.getGridModel("chukumingxiList").doRender();
    },
    fail: function (err) {
      var message = err.message; // 错误信息
      console.log(message, "扫码错误，请重试");
    }
  });
});