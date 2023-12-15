//扫码入库
viewModel.get("1671788874705_1").on("click", (data) => {
  mtl.scanQRCode({
    scanType: ["qrCode", "barCode"],
    needResult: 1,
    success: function (res) {
      var result = res.resultStr;
      let result_copy = JSON.parse(result);
      console.log(result_copy, "-----result_copy");
      let rowIndex = viewModel.getGridModel("rukumingxiList").getFocusedRowIndex();
      viewModel.getGridModel("rukumingxiList").setCellValue(rowIndex, "caigoudingdanpo", result_copy.buy_no);
      viewModel.getGridModel("rukumingxiList").setCellValue(rowIndex, "wuliaobianma_id", result_copy.caigoushangwuliao); //物料编码
      viewModel.getGridModel("rukumingxiList").setCellValue(rowIndex, "wuliaomingchen", result_copy.caigoushangwuliao_materialName); //物料名称
      viewModel.getGridModel("rukumingxiList").setCellValue(rowIndex, "yingshoushuliang", result_copy.delivery_quantity);
      //入库数量
      viewModel.getGridModel("rukumingxiList").setCellValue(rowIndex, "ziduan4", result_copy.caigoushangwuliao_materialSpec); //规格
      viewModel.getGridModel("rukumingxiList").setCellValue(rowIndex, "danjia", result_copy.price); //单价
      viewModel.getGridModel("rukumingxiList").setCellValue(rowIndex, "youxiaoqilanwei", result_copy.shelf_life); //有效期
      viewModel.getGridModel("rukumingxiList").setCellValue(rowIndex, "caigouyuan_name", result_copy.caigouyuan_name); //采购员
      viewModel.getGridModel("rukumingxiList").setCellValue(rowIndex, "caigouyuan", result_copy.caigouyuan);
      viewModel.getGridModel("rukumingxiList").setCellValue(rowIndex, "gongyingshang", result_copy.gongyingshang); //gongyingshang
      viewModel.getGridModel("rukumingxiList").setCellValue(rowIndex, "gongyingshang_name", result_copy.gongyingshang_name);
      viewModel.getGridModel("rukumingxiList").doRender();
    },
    fail: function (err) {
      var message = err.message; // 错误信息
      console.log(message, "扫码错误，请重试");
    }
  });
});