let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var datas = request.data;
    var object = [];
    for (var i = 0; i < datas.length; i++) {
      //猪场编码
      var pigFarmCode = datas[i].invite_code;
      if (pigFarmCode == undefined || pigFarmCode == "") {
        throw new Error("【猪场编码是必填项】");
      }
      //猪场code
      var pigcode = "select * from AT17604A341D580008.AT17604A341D580008.pigFarm where pig_Code = '" + pigFarmCode + "' and dr =0";
      var pigCoderes = ObjectStore.queryByYonQL(pigcode, "developplatform");
      if (pigCoderes.length == 0) {
        var err = " 【 猪场编码:" + pigFarmCode + "不存在,请检查】  ";
        throw new Error(err);
      }
      //查询猪场数据库获取猪场id
      var farmid = pigCoderes[0].id;
      //公司编码
      var companyCode = datas[i].company_code;
      if (companyCode == undefined || companyCode == "") {
        throw new Error("【公司编码是必填项】");
      }
      var zzSql = "select * from org.func.BaseOrg where code = '" + companyCode + "' and dr =0";
      var zzres = ObjectStore.queryByYonQL(zzSql, "orgcenter");
      if (zzres.length == 0) {
        var err = "  【组织字段查询为空,请检查】  ";
        throw new Error(err);
      }
      var orgids = zzres[0].id;
      //猪舍编码
      var bldgCode = datas[i].bldg_code;
      if (bldgCode == undefined || bldgCode == "") {
        throw new Error("【猪舍编码是必填项】");
      }
      //联合查询
      var dailyInventorySql =
        "select id from AT17604A341D580008.AT17604A341D580008.hogHouse where Farm_id = '" + farmid + "' and org_id = '" + orgids + "' and house_code = '" + bldgCode + "' and dr=0 ";
      var dailyInventoryRes = ObjectStore.queryByYonQL(dailyInventorySql, "developplatform");
      if (dailyInventoryRes.length == 0) {
        var err = "【根据条件数据查询为空,猪场编码:" + pigFarmCode + ",公司编码:" + companyCode + ",猪舍编码:'" + bldgCode + "'】";
        throw new Error(err);
      }
      for (var a = 0; a < dailyInventoryRes.length; a++) {
        var ids = dailyInventoryRes[a];
        var zsID = ids.id;
        //查询批次变动表是否引用猪舍编码
        var bdbSql = "select id from AT17604A341D580008.AT17604A341D580008.batchChangeTable where zhushe = '" + zsID + "' and dr = 0";
        var bdbres = ObjectStore.queryByYonQL(bdbSql, "developplatform");
        if (bdbres.length != 0) {
          throw new Error("【 猪舍编码:" + bldgCode + ",公司编码:'" + companyCode + "'数据已经被批次变动表引用,无法删除】");
        }
        //查询批次日存栏是否引用猪舍编码
        var rclSql = "select id from AT17604A341D580008.AT17604A341D580008.batchColumn where zhushe = '" + zsID + "' and dr = 0";
        var rclres = ObjectStore.queryByYonQL(rclSql, "developplatform");
        if (rclres.length != 0) {
          throw new Error("【 猪舍编码:" + bldgCode + ",公司编码:'" + companyCode + "'数据已经被批次日存栏引用,无法删除】");
        }
        object.push(ids);
      }
    }
    var res = ObjectStore.deleteBatch("AT17604A341D580008.AT17604A341D580008.hogHouse", object, "hogHouse");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });