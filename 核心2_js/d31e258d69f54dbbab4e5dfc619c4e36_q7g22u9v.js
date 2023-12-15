let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取生产经营类别、剂型、物料基本分类、物料各组件的值
    let { productionManageCategory_name, dosage_name, materielSort_name, materielCode_code } = param.data[0].XPH_CFileList[0];
    // 判断这四个字段的值是否同时为空
    if (typeof productionManageCategory_name === "undefined" || productionManageCategory_name === null) {
      if (typeof dosage_name === "undefined" || dosage_name === null) {
        if (typeof materielSort_name === "undefined" || materielSort_name === null) {
          if (typeof materielCode_code === "undefined" || materielCode_code === null) {
            // 若同时为空，则弹窗提示：生产经营类别、剂型、物料基本分类、物料四者不得同时为空
            throw new Error("生产经营类别、剂型、物料基本分类、物料四者不得同时为空");
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });