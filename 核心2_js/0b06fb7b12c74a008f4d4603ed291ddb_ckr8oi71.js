let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var datas = request.data;
    var object = [];
    for (var i = 0; i < datas.length; i++) {
      //生产记录
      var rop = datas[i].event_id;
      if (rop == undefined || rop == "") {
        throw new Error("【生产记录是必填项】");
      }
      var rops = rop + "";
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
      var companyCode = datas[i].orgCode;
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
      //业务类型
      var YwType = datas[i].Business_Type;
      YwType = YwType + "";
      if (
        YwType != "1" &&
        YwType != "2" &&
        YwType != "3" &&
        YwType != "4" &&
        YwType != "5" &&
        YwType != "6" &&
        YwType != "7" &&
        YwType != "8" &&
        YwType != "9" &&
        YwType != "10" &&
        YwType != "11" &&
        YwType != "12" &&
        YwType != "13" &&
        YwType != "14" &&
        YwType != "15" &&
        YwType != "16" &&
        YwType != "17" &&
        YwType != "18" &&
        YwType != "19" &&
        YwType != "20"
      ) {
        var err = "  【请输入正确业务类型枚举值】  ";
        throw new Error(err);
      }
      var alterationSql =
        "select id from AT17604A341D580008.AT17604A341D580008.batchChangeTable" +
        " where shengchanjilu ='" +
        rops +
        "' and zhuchang = '" +
        farmid +
        "' and org_id ='" +
        orgids +
        "' and yewuleixing = '" +
        YwType +
        "' and dr = 0";
      var alterationRes = ObjectStore.queryByYonQL(alterationSql, "developplatform");
      if (alterationRes.length == 0) {
        var err = "  -- 根据条件数据查询为空,生产记录id:" + rops + ",猪场编码:" + pigFarmCode + ",公司编码:" + companyCode + " --  ";
        throw new Error(err);
      }
      for (var a = 0; a < alterationRes.length; a++) {
        var ids = alterationRes[a];
        object.push(ids);
      }
    }
    var res = ObjectStore.deleteBatch("AT17604A341D580008.AT17604A341D580008.batchChangeTable", object, "batchChangeTable");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });