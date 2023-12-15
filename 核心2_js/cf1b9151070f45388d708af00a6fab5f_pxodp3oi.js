let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    let id = pdata.id;
    let gsSuffix = "_HB";
    let gsURI = "GT3734AT5.GT3734AT5.GongSi" + gsSuffix;
    let resData = ObjectStore.selectById(gsURI, { id: id }); //,"3199a3d6"
    let isRelated = resData.isRelated;
    if (isRelated) {
      throw new Error("已关联客户档案，不能删除!");
    }
    let tongBuZhuangTai = resData.tongBuZhuangTai;
    if (tongBuZhuangTai) {
      throw new Error("已同步到富通，不能删除!");
    }
    //已关联方案申请不能推
    let org_id = resData.org_id;
    let bURI = "GT3734AT5.GT3734AT5.AIMIXXPFASQ";
    if (org_id == "1573823532355289104") {
      //建机事业部AIMIX
      bURI = "GT3734AT5.GT3734AT5.AIMIXXPFASQ";
    } else if (org_id == "1573823532355289110") {
      //环保-百特
      bURI = "GT3734AT5.GT3734AT5.BTXPFASQ";
    } else {
      //游乐1573823532355289106
      bURI = "GT3734AT5.GT3734AT5.YLXPFASQ"; //CustomerName
    }
    let resCount = ObjectStore.queryByYonQL("select count(1) as relateNum from " + bURI + " where CustomerName='" + id + "'", "developplatform");
    if (resCount[0].relateNum > 0) {
      throw new Error("潜客档案已被方案申请单关联引用，不能删除!");
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });