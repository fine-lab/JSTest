let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var idnumber = request.id;
    //根据完结审批单的id查出（出证合同主键id）
    var sql = "select * from GT8313AT35.GT8313AT35.jjwzspd where id = '" + idnumber + "'";
    var jjwz = ObjectStore.queryByYonQL(sql);
    //根据查出来的出证合同id来更新状态的值
    var czhth = jjwz[0].chuzhenghetonghao;
    var czht = { id: czhth, hetongzhuangtai: "8" };
    var res1 = ObjectStore.updateById("GT8313AT35.GT8313AT35.jjczht", czht, "829b6f03");
    //根据查出证合同主键id，查出人才库的id(收证合同号id就是)
    var rckxx = "select * from GT8313AT35.GT8313AT35.jjczht where id = '" + czhth + "'";
    var rck = ObjectStore.queryByYonQL(rckxx);
    var czsyf = rck[0].Telephone;
    var fwrcksyid = rck[0].id;
    var uprckzt = rck[0].CertificateReceivingContractNo;
    if (czsyf == 1) {
      //查询服务人才库
      var fwrck = "select * from GT8313AT35.GT8313AT35.ServiceCentre where source_id = '" + fwrcksyid + "'";
      var fw = ObjectStore.queryByYonQL(fwrck);
      var id = fw[0].id;
      //更新服务人才库状态
      var upfwrck = { id: id, zhuangtai: "8" };
      var res5 = ObjectStore.updateById("GT8313AT35.GT8313AT35.ServiceCentre", upfwrck, "fbdcef39");
      return { res5 };
    }
    //更新人才库的状态
    var uprck = { id: uprckzt, state: "3" };
    var res2 = ObjectStore.updateById("GT8313AT35.GT8313AT35.JinJianTalentPoolFile", uprck, "cab36459");
    //查询人才库轨迹子表的id
    var rckgjzb = "select * from GT8313AT35.GT8313AT35.guiji where JinJianTalentPoolFile_id = '" + uprckzt + "' and source_id = '" + czhth + "'";
    var rckgj = ObjectStore.queryByYonQL(rckgjzb);
    var gjzjid = rckgj[0].id;
    //更新人才库轨迹的出证合同状态状
    var object = { id: uprckzt, guijiList: [{ id: gjzjid, hetongzhuangtai: "8", _status: "Update" }] };
    var uprckgj = ObjectStore.updateById("GT8313AT35.GT8313AT35.JinJianTalentPoolFile", object, "cab36459");
    //根据人才库的主键id，查收证合同的id
    var szhtxx = "select * from GT8313AT35.GT8313AT35.JinJianTalentPoolFile where id ='" + uprckzt + "'";
    var res4 = ObjectStore.queryByYonQL(szhtxx);
    var szht = res4[0].source_id;
    //更新收证合同的状态
    var upszht = { id: szht, state: "3" };
    var res3 = ObjectStore.updateById("GT8313AT35.GT8313AT35.CertificateReceivingContract", upszht, "770602ef");
  }
}
exports({ entryPoint: MyAPIHandler });