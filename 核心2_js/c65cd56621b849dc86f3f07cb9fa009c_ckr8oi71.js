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
        //猪舍编码
        var houseCode = datas[i].house_code;
        if (houseCode == undefined || houseCode == "") {
          throw new Error("【猪舍编码是必填项】");
        }
        var houseCodes = houseCode + "";
        //猪舍id唯一
        var houseid = datas[i].bldg_id;
        if (houseid == undefined || houseid == "") {
          throw new Error("【猪舍ID是必填项】");
        }
        var pigIsOne = "select * from AT17604A341D580008.AT17604A341D580008.hogHouse where bldg_id = '" + houseid + "' and dr =0";
        var pigIsOneres = ObjectStore.queryByYonQL(pigIsOne, "developplatform");
        if (pigIsOneres.length != 0) {
          var err = "  -- 猪舍ID:" + houseid + "已经存在,请检查 --  ";
          throw new Error(err);
        }
        var names = datas[i].name;
        if (names == undefined || names == "") {
          throw new Error("【猪舍名称是必填项】");
        }
        //猪舍类型
        var BldgType = datas[i].Bldg_type;
        BldgType = BldgType + "";
        if (BldgType == undefined || BldgType == "") {
          throw new Error("【猪舍类型是必填项】");
        }
        if (BldgType != "1" && BldgType != "2" && BldgType != "3" && BldgType != "4" && BldgType != "5" && BldgType != "6" && BldgType != "7" && BldgType != "0") {
          var err = "  【请输入正确猪舍场类型枚举值】  ";
          throw new Error(err);
        }
        //猪场编码[根据编码查询猪场id]
        var farmCode = datas[i].Farm_id;
        if (farmCode == undefined || farmCode == "") {
          throw new Error("【猪场编码是必填项】");
        }
        var pigcode = "select * from AT17604A341D580008.AT17604A341D580008.pigFarm where pig_Code = '" + farmCode + "' and dr =0";
        var pigCoderes = ObjectStore.queryByYonQL(pigcode, "developplatform");
        if (pigCoderes.length == 0) {
          var err = "  -- 猪场编码:" + farmCode + "不存在,请检查 --  ";
          throw new Error(err);
        }
        //查询猪场数据库获取猪场id
        var farmid = pigCoderes[0].id;
        //猪舍状态
        var pstatus = datas[i].pig_status;
        if (pstatus != 1 && pstatus != 0) {
          var err = "  -- 请输入正确猪舍状态值 --  ";
          throw new Error(err);
        }
        var body = {
          org_id: orgids,
          house_code: houseCodes,
          bldg_id: houseid,
          name: names,
          zhusheleixing: BldgType,
          Farm_id: farmid,
          enable: pstatus
        };
        objectI.push(body);
      } else if (statusC == "Update") {
        //猪舍编码
        var houseCode = datas[i].house_code;
        if (houseCode == undefined || houseCode == "") {
          throw new Error("【猪舍编码是必填项】");
        }
        var houseCodes = houseCode + "";
        //猪舍id唯一
        var houseid = datas[i].bldg_id;
        if (houseid == undefined || houseid == "") {
          throw new Error("【猪舍ID是必填项】");
        }
        var pigIsOne = "select * from AT17604A341D580008.AT17604A341D580008.hogHouse where bldg_id = '" + houseid + "' and dr =0";
        var pigIsOneres = ObjectStore.queryByYonQL(pigIsOne, "developplatform");
        if (pigIsOneres.length == 0) {
          var err = "  -- 猪舍ID:" + houseCodes + "不存在,无法修改 --  ";
          throw new Error(err);
        }
        var zid = pigIsOneres[0].id;
        var names = datas[i].name;
        if (names == undefined || names == "") {
          throw new Error("【猪舍名称是必填项】");
        }
        //猪舍类型
        var BldgType = datas[i].Bldg_type;
        BldgType = BldgType + "";
        if (BldgType == undefined || BldgType == "") {
          throw new Error("【猪舍类型是必填项】");
        }
        if (BldgType != "1" && BldgType != "2" && BldgType != "3" && BldgType != "4" && BldgType != "5" && BldgType != "6" && BldgType != "7" && BldgType != "0") {
          var err = "  【请输入正确猪舍场类型枚举值】  ";
          throw new Error(err);
        }
        //猪场编码[根据编码查询猪场id]
        var farmCode = datas[i].Farm_id;
        if (farmCode == undefined || farmCode == "") {
          throw new Error("【猪场编码是必填项】");
        }
        var pigcode = "select * from AT17604A341D580008.AT17604A341D580008.pigFarm where pig_Code = '" + farmCode + "' and dr =0";
        var pigCoderes = ObjectStore.queryByYonQL(pigcode, "developplatform");
        if (pigCoderes.length == 0) {
          var err = "  -- 猪场编码:" + houseCode + "不存在,请检查 --  ";
          throw new Error(err);
        }
        //查询猪场数据库获取猪场id
        var farmid = pigCoderes[0].id;
        //猪舍状态
        var pstatus = datas[i].pig_status;
        if (pstatus != 1 && pstatus != 0) {
          var err = "  -- 请输入正确猪舍状态值 --  ";
          throw new Error(err);
        }
        var body = {
          id: zid,
          org_id: orgids,
          bldg_id: houseid,
          house_code: houseCodes,
          name: names,
          zhusheleixing: BldgType,
          Farm_id: farmid,
          enable: pstatus
        };
        objectU.push(body);
      } else {
        var err = "  -- 操作标识:" + statusC + "输入有误,请检查 --  ";
        throw new Error(err);
      }
    }
    //修改
    var res1 = ObjectStore.updateBatch("AT17604A341D580008.AT17604A341D580008.hogHouse", objectU, "hogHouse");
    //新增
    var res2 = ObjectStore.insertBatch("AT17604A341D580008.AT17604A341D580008.hogHouse", objectI, "hogHouse");
    return { Update: res1, Insert: res2 };
  }
}
exports({ entryPoint: MyAPIHandler });