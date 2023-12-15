let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取总体需求成本实体
    var ztxqcbdh = param.data[0];
    if (!!ztxqcbdh) {
      if (!!ztxqcbdh.id) {
        //编辑
        if (!!ztxqcbdh.B0002List) {
          //判断是否有子单
          for (var i = 0; i < ztxqcbdh.B0002List.length; i++) {
            if (!!ztxqcbdh.B0002List[i].sourcechild_id) {
              if (ztxqcbdh.B0002List[i]._status != "Delete") {
                //获取上游单据已推、未推信息
                var res = ObjectStore.queryByYonQL("select * from GT64173AT6.GT64173AT6.D0002 where id='" + ztxqcbdh.B0002List[i].sourcechild_id + "'");
                //获取当前单据生效的已推、未推信息
                var res1 = ObjectStore.queryByYonQL("select * from GT64178AT7.GT64178AT7.B0002 where id='" + ztxqcbdh.B0002List[i].id + "'");
                if (res.length > 0) {
                  if (res1.length > 0) {
                    //判断本单据和上游子单据金额
                    if (
                      ztxqcbdh.B0002List[i].hanshuijine + res[0].yituizongjine - res1[0].hanshuijine > res[0].hanshuijine ||
                      res[0].weituizongjine + res1[0].hanshuijine < ztxqcbdh.B0002List[i].zongjine
                    ) {
                      throw new Error(
                        "剩余未推金额不足，对应单据行第" +
                          (i + 1) +
                          "行" +
                          "当前金额" +
                          ztxqcbdh.B0002List[i].hanshuijine +
                          ",未推金额" +
                          res[0].weituizongjine +
                          ",已推金额" +
                          res[0].yituizongjine +
                          "总金额" +
                          res[0].hanshuijine
                      );
                    }
                    //判断本单据和上游子单据数量
                    if (ztxqcbdh.B0002List[i].ziduan3 + res[0].yituishuliang - res1[0].ziduan3 > res[0].shuliang || res[0].weituishuliang + res1[0].ziduan3 < ztxqcbdh.B0002List[i].ziduan3) {
                      throw new Error(
                        "剩余未推数量不足，对应单据行第" +
                          (i + 1) +
                          "行" +
                          "当前数量" +
                          ztxqcbdh.B0002List[i].ziduan3 +
                          ",未推数量" +
                          res[0].weituishuliang +
                          ",已推数量" +
                          res[0].yituishuliang +
                          "总数量" +
                          res[0].shuliang
                      );
                    }
                  } else {
                  }
                } else {
                }
              }
            }
          }
        }
      } else {
        //新增
        if (!!ztxqcbdh.B0002List) {
          //判断是否有子单
          for (var i = 0; i < ztxqcbdh.B0002List.length; i++) {
            if (!!ztxqcbdh.B0002List[i].sourcechild_id) {
              var res = ObjectStore.queryByYonQL("select * from GT64173AT6.GT64173AT6.D0002 where id='" + ztxqcbdh.B0002List[i].sourcechild_id + "'");
              if (res.length > 0) {
                //判断本单据和上游子单据金额
                if (ztxqcbdh.B0002List[i].hanshuijine + res[0].yituizongjine > res[0].hanshuijine || res[0].weituizongjine < ztxqcbdh.B0002List[i].zongjine) {
                  throw new Error(
                    "剩余未推金额不足，对应单据行第" +
                      (i + 1) +
                      "行" +
                      "当前金额" +
                      ztxqcbdh.B0002List[i].hanshuijine +
                      ",未推金额" +
                      res[0].weituizongjine +
                      ",已推金额" +
                      res[0].yituizongjine +
                      "总金额" +
                      res[0].hanshuijine
                  );
                }
                //判断本单据和上游子单据数量
                if (ztxqcbdh.B0002List[i].ziduan3 + res[0].yituishuliang > res[0].shuliang || res[0].weituishuliang < ztxqcbdh.B0002List[i].ziduan3) {
                  throw new Error(
                    "剩余未推数量不足，对应单据行第" +
                      (i + 1) +
                      "行" +
                      "当前数量" +
                      ztxqcbdh.B0002List[i].ziduan3 +
                      ",未推数量" +
                      res[0].weituishuliang +
                      ",已推数量" +
                      res[0].yituishuliang +
                      "总数量" +
                      res[0].shuliang
                  );
                }
              } else {
              }
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });