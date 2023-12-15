let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var datas = request.data;
    //新增
    var objectI = [];
    //修改
    var objectU = [];
    for (var i = 0; i < datas.length; i++) {
      var orgid = datas[i].orgid;
      if (orgid == undefined || orgid == "") {
        throw new Error("【公司编码是必填项】");
      }
      var zzSql = "select * from org.func.BaseOrg where code = '" + orgid + "' and dr =0";
      var zzres = ObjectStore.queryByYonQL(zzSql, "orgcenter");
      if (zzres.length == 0) {
        var err = "  -- 组织字段查询为空,请检查 --  ";
        throw new Error(err);
      }
      var orgids = zzres[0].id;
      var statusC = datas[i]._status;
      if (statusC == "Insert") {
        var pigCode = datas[i].pig_Code;
        var pigIsOne = "select * from AT17604A341D580008.AT17604A341D580008.pigFarm where pig_Code = '" + pigCode + "' and dr =0";
        var pigIsOneres = ObjectStore.queryByYonQL(pigIsOne, "developplatform");
        if (pigIsOneres.length != 0) {
          var err = "  【 猪场编码:" + pigCode + "已经存在,请检查 】  ";
          throw new Error(err);
        }
        var names = datas[i].name;
        if (names == undefined || names == "") {
          throw new Error("【猪场名称是必填项】");
        }
        var farmType = datas[i].Farm_type;
        farmType = farmType + "";
        if (farmType == undefined || farmType == "") {
          throw new Error("【猪场类型是必填项】");
        }
        if (farmType != "1" && farmType != "2" && farmType != "3" && farmType != "4" && farmType != "5" && farmType != "6") {
          var err = "  【请输入正确猪场类型枚举值】  ";
          throw new Error(err);
        }
        var pstatus = datas[i].p_status;
        if (pstatus != 1 && pstatus != 0) {
          var err = "  【请输入正确猪场状态值】  ";
          throw new Error(err);
        }
        var body = {
          org_id: orgids,
          pig_Code: pigCode,
          name: names,
          Farm_type: farmType,
          enable: pstatus
        };
        objectI.push(body);
      } else if (statusC == "Update") {
        var pigCode = datas[i].pig_Code;
        var pigIsOne = "select * from AT17604A341D580008.AT17604A341D580008.pigFarm where pig_Code = '" + pigCode + "' and dr =0";
        var pigIsOneres = ObjectStore.queryByYonQL(pigIsOne, "developplatform");
        if (pigIsOneres.length == 0) {
          var err = "  -- 猪场编码:" + pigCode + "不存在,无法修改 --  ";
          throw new Error(err);
        }
        var zid = pigIsOneres[0].id;
        var names = datas[i].name;
        var farmType = datas[i].Farm_type;
        farmType = farmType + "";
        if (farmType == undefined || farmType == "") {
          throw new Error("【猪场类型是必填项】");
        }
        if (farmType != "1" && farmType != "2" && farmType != "3" && farmType != "4" && farmType != "5" && farmType != "6") {
          var err = "  【请输入正确猪场类型枚举值】  ";
          throw new Error(err);
        }
        var pstatus = datas[i].p_status;
        if (pstatus != 1 && pstatus != 0) {
          var err = "  -- 请输入正确猪场状态值 --  ";
          throw new Error(err);
        }
        var body = {
          id: zid,
          org_id: orgids,
          pig_Code: pigCode,
          name: names,
          Farm_type: farmType,
          enable: pstatus
        };
        objectU.push(body);
      } else {
        var err = "  -- 操作标识:" + statusC + "输入有误,请检查 --  ";
        throw new Error(err);
      }
    }
    //修改
    var res1 = ObjectStore.updateBatch("AT17604A341D580008.AT17604A341D580008.pigFarm", objectU, "pigFarm");
    //新增
    var res2 = ObjectStore.insertBatch("AT17604A341D580008.AT17604A341D580008.pigFarm", objectI, "pigFarm");
    return { Update: res1, Insert: res2 };
  }
}
exports({ entryPoint: MyAPIHandler });