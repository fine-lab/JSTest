viewModel.on("afterLoadData", function (args) {
  let details = args.purInRecords;
  if (details) {
    //查询数据库当前数据条数
    let sum = 0;
    for (let j = 0; j < details.length; j++) {
      let extendReceiptBatchNo = details[j].extendReceiptBatchNo;
      if (!extendReceiptBatchNo) {
        sum = sum + 1;
      }
    }
    let result = cb.rest.invokeFunction("ST.backOpenApiFunction.generateBatchNum", { len: sum }, function (err, res) {}, viewModel, { async: false });
    let len = result.result.codeNum;
    let codeStart = result.result.codeStart;
    for (let i = 0; i < details.length; i++) {
      let extendReceiptBatchNo = details[i].extendReceiptBatchNo;
      if (!extendReceiptBatchNo) {
        let codeEnd = len + i;
        let codeEndStr = codeEnd + "";
        codeEndStr = codeEndStr.padStart(4, "0");
        details[i].extendReceiptBatchNo = codeStart + codeEndStr;
      }
    }
    debugger;
  }
});