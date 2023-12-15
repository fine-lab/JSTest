let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var model = request.model;
    //拿到主表id
    var id = model.id;
    if (model.yesOrNo != "2") {
      var object11 = { id: model.id, yesOrNo: "2" };
      var res11 = ObjectStore.updateById("GT102917AT3.GT102917AT3.Taskorders", object11, "2233f1ef");
      //根据主表id查询主表下所有子表信息
      var sql = "select * from GT102917AT3.GT102917AT3.Taskorderdetailss where  Taskorders_id = '" + id + "'";
      var res = ObjectStore.queryByYonQL(sql);
      var sql = "select hetonghao from GT102917AT3.GT102917AT3.Taskorders where  id = '" + id + "'";
      var HTH = ObjectStore.queryByYonQL(sql);
      var array = new Array();
      for (var i = 0; i < res.length; i++) {
        var list = {};
        var res2 = {
          shengchangonghao: res[i].shengchangonghao,
          branch: res[i].branch,
          TaskorderdetailsFk: res[i].TaskorderdetailsFk,
          anzhuangzujiesuanjin: -res[i].anzhuangzujiesuanjin,
          beizhu: res[i].beizhu,
          ceng: res[i].ceng,
          dr: res[i].dr,
          fangzu: -res[i].fangzu,
          gongshixiaoji: -res[i].gongshixiaoji,
          isFlowCoreBill: res[i].isFlowCoreBill,
          jisuangongshi: res[i].jisuangongshi,
          men: res[i].men,
          pubts: res[i].pubts,
          tenant_id: res[i].tenant_id,
          xinghao: res[i].xinghao,
          ytenant: res[i].ytenant,
          zhan: res[i].zhan,
          _status: "Update"
        };
        list = res2;
        array.push(list);
      }
      var object = {
        yesOrNo: "2",
        item208ma: 1,
        hetonghao: HTH[0].hetonghao,
        fenke: model.fenke,
        anzhuangyaoqiuzhiliangfenshu: model.anzhuangyaoqiuzhiliangfenshu,
        anzhuangzhouqi: model.anzhuangzhouqi,
        baodiaoriqi: model.baodiaoriqi,
        baoyanshouriqi: model.baoyanshouriqi,
        beizhu: model.beizhu,
        code: model.code,
        diantiyijiaoriqi: model.diantiyijiaoriqi,
        diaoshiwanriqi: model.diaoshiwanriqi,
        fahuoriqi: model.fahuoriqi,
        feibiaojiageshuoming: model.feibiaojiageshuoming,
        hejijine: -model.hejijine,
        isFlowCoreBill: model.isFlowCoreBill,
        isWfControlled: model.isWfControlled,
        jiafanglianxiren: model.jiafanglianxiren,
        jiafanglianxirendianhua: model.jiafanglianxirendianhua,
        jianlilianxirendianhua: model.jianlilianxirendianhua,
        jinchangriqi: model.jinchangriqi,
        pubts: model.pubts,
        shigongbanzurenyuan: model.shigongbanzurenyuan,
        tuichangriqi: model.tuichangriqi,
        verifystate: model.verifystate,
        weituodanwei: model.weituodanwei,
        yanshouwanchengriqi: model.yanshouwanchengriqi,
        yaoqiujianchafenshu: model.yaoqiujianchafenshu,
        ytenant: model.ytenant,
        zongbaolianxiren: model.zongbaolianxiren,
        zongbaolianxirendianhua: model.zongbaolianxirendianhua,
        _id: model._id,
        TaskorderdetailssList: array
      };
      var res1 = ObjectStore.insert("GT102917AT3.GT102917AT3.Taskorders", object, "2233f1ef");
      var asd = HTH[0].hetonghao;
    } else {
      throw new Error(1);
    }
    return { res1 };
  }
}
exports({ entryPoint: MyAPIHandler });