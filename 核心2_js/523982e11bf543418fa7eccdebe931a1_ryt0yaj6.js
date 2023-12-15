let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取总体需求成本实体
    var ztxqcbdh = param.data[0];
    if (!!ztxqcbdh.C003List) {
      //判断是否有子表信息
      for (var i = 0; i < ztxqcbdh.C003List.length; i++) {
        if (!!ztxqcbdh.C003List[i].C0001_id_id) {
          var res = ObjectStore.queryByYonQL("select * from GT64178AT7.GT64178AT7.B0002 where id='" + ztxqcbdh.C003List[i].C0001_id_id + "'");
          if (res.length > 0) {
            //判断本单据和上游子单据金额
            if (ztxqcbdh.C003List[i].zongjine + res[0].yituizongjine > res[0].hanshuijine) {
              throw new Error(
                "剩余未推金额不足，对应单据行第" +
                  (i + 1) +
                  "行" +
                  "当前金额" +
                  ztxqcbdh.C003List[i].zongjine +
                  ",未推金额" +
                  res[0].weituizongjine +
                  ",已推金额" +
                  res[0].yituizongjine +
                  "总金额" +
                  res[0].hanshuijine +
                  "|计算值:" +
                  (ztxqcbdh.C003List[i].zongjine + res[0].yituizongjine) +
                  "|对比值:" +
                  res[0].hanshuijine
              );
            }
            //判断本单据和上游子单据数量
            if (ztxqcbdh.C003List[i].shuliang + res[0].yituishuliang > res[0].ziduan3) {
              throw new Error(
                "剩余未推数量不足，对应单据行第" +
                  (i + 1) +
                  "行" +
                  "当前数量" +
                  ztxqcbdh.C003List[i].shuliang +
                  ",未推数量" +
                  res[0].weituishuliang +
                  ",已推数量" +
                  res[0].yituishuliang +
                  "总数量" +
                  res[0].ziduan3 +
                  "|计算值:" +
                  (ztxqcbdh.C003List[i].shuliang + res[0].yituishuliang) +
                  "|对比值:" +
                  res[0].ziduan3
              );
            }
          } else {
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });