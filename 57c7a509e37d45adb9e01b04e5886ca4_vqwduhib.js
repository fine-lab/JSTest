let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var mainArr = request;
    if (null == mainArr || 0 == mainArr.length) {
      return;
    }
    var mergeArr = [];
    var subscript = [];
    while (subscript.length != mainArr.length) {
      for (var i = mainArr.length - 1; i >= 0; i--) {
        let d = mainArr[i];
        if (mergeArr.length == 0) {
          mergeArr.push(d);
          subscript.push(mainArr.length - 1);
        } else {
          for (var s = mergeArr.length - 1; s >= 0; s--) {
            let x = mergeArr[s];
            if (d.skuCode == x.skuCode && d.product_code == x.product_code && d.batchno == x.batchno && d.XSDD004 == x.XSDD004 && d.sellType == x.sellType) {
              x.extendTotalQualified = String(parseInt(x.extendTotalQualified) + parseInt(d.extendTotalQualified));
              x.oriSum = String(parseFloat(x.oriSum) + parseFloat(d.oriSum)); // 含税金额
              x.XSDD004 = String(parseFloat(x.XSDD004) + parseFloat(d.XSDD004)); // 行折扣额
              mergeArr[s] = x;
              subscript.push(i);
              break;
            } else if (0 == s) {
              mergeArr.push(d);
              subscript.push(i);
              break;
            }
          }
        }
      }
    }
    return { mergeArr: mergeArr };
  }
}
exports({
  entryPoint: MyAPIHandler
});