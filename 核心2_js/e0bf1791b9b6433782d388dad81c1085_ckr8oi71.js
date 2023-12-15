let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var datas = request.data;
    var object = [];
    for (var i = 0; i < datas.length; i++) {
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
      //猪场编码
      var pigFarmCode = datas[i].invite_code;
      if (pigFarmCode == undefined || pigFarmCode == "") {
        throw new Error("【猪场编码是必填项】");
      }
      //猪场code
      var pigcode = "select id from AT17604A341D580008.AT17604A341D580008.pigFarm where pig_Code = '" + pigFarmCode + "' and dr =0 and org_id = '" + orgids + "'";
      var pigCoderes = ObjectStore.queryByYonQL(pigcode, "developplatform");
      if (pigCoderes.length == 0) {
        var err = " 【 猪场编码:" + pigFarmCode + ",公司编码:'" + companyCode + "'数据不存在,无法删除】  ";
        throw new Error(err);
      }
      //查询猪场数据库获取猪场id
      for (var a = 0; a < pigCoderes.length; a++) {
        var ids = pigCoderes[a];
        var zsID = ids.id;
        //查询猪舍是否引用猪场编码
        var zsSql = "select id from AT17604A341D580008.AT17604A341D580008.hogHouse where Farm_id = '" + zsID + "' and dr = 0";
        var zsres = ObjectStore.queryByYonQL(zsSql, "developplatform");
        if (zsres.length != 0) {
          throw new Error("【 猪场编码:" + pigFarmCode + ",公司编码:'" + companyCode + "'数据已经被猪舍引用,无法删除】");
        }
        //查询批次变动表是否引用猪场编码
        var bdbSql = "select id from AT17604A341D580008.AT17604A341D580008.batchChangeTable where zhuchang = '" + zsID + "' and dr = 0";
        var bdbres = ObjectStore.queryByYonQL(bdbSql, "developplatform");
        if (bdbres.length != 0) {
          throw new Error("【 猪场编码:" + pigFarmCode + ",公司编码:'" + companyCode + "'数据已经被批次变动表引用,无法删除】");
        }
        //查询批次日存栏是否引用猪场编码
        var rclSql = "select id from AT17604A341D580008.AT17604A341D580008.batchColumn where zhuchang = '" + zsID + "' and dr = 0";
        var rclres = ObjectStore.queryByYonQL(rclSql, "developplatform");
        if (rclres.length != 0) {
          throw new Error("【 猪场编码:" + pigFarmCode + ",公司编码:'" + companyCode + "'数据已经被批次日存栏引用,无法删除】");
        }
        object.push(ids);
      }
    }
    var res = ObjectStore.deleteBatch("AT17604A341D580008.AT17604A341D580008.pigFarm", object, "pigFarm");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });