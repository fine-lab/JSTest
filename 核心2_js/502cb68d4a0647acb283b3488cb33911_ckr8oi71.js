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
      var zzSql = "select id from org.func.BaseOrg where code = '" + orgid + "' and dr =0";
      var zzres = ObjectStore.queryByYonQL(zzSql, "orgcenter");
      if (zzres.length == 0) {
        var err = "  -- 组织字段查询为空,请检查 --  ";
        throw new Error(err);
      }
      var orgids = zzres[0].id;
      var statusC = datas[i]._status;
      if (statusC == "Insert") {
        //集团名称
        var Groupname = datas[i].Group_name;
        if (Groupname == undefined || Groupname == "") {
          throw new Error("【集团名称是必填项】");
        }
        //法人公司
        var Company = datas[i].Company;
        if (Company == undefined || Company == "") {
          throw new Error("【法人公司字段是必填项】");
        }
        //猪场code
        var PigCodes = datas[i].Pig_Code;
        if (PigCodes == undefined || PigCodes == "") {
          throw new Error("【猪场编码是必填项】");
        }
        var pigcode = "select id from AT17604A341D580008.AT17604A341D580008.pigFarm where pig_Code = '" + PigCodes + "' and dr =0";
        var pigCoderes = ObjectStore.queryByYonQL(pigcode, "developplatform");
        if (pigCoderes.length == 0) {
          var err = "  -- 猪场编码:" + PigCodes + "不存在,请检查 --  ";
          throw new Error(err);
        }
        //查询猪场数据库获取猪场id
        var farmid = pigCoderes[0].id;
        //统计日期
        var Dates = datas[i].Date;
        if (Dates == undefined || Dates == "") {
          throw new Error("【统计日期是必填项】");
        }
        //批次号
        var Batchnumb = datas[i].Batch_numb;
        if (Batchnumb == undefined || Batchnumb == "") {
          throw new Error("【批次号是必填项】");
        }
        //猪舍code
        var Housecode = datas[i].House_code;
        var Housecodes = Housecode + "";
        if (Housecodes == undefined || Housecodes == "") {
          throw new Error("【猪舍编码是必填项】");
        }
        var pigIsOne = "select id from AT17604A341D580008.AT17604A341D580008.hogHouse where house_code = '" + Housecodes + "' and dr =0";
        var pigIsOneres = ObjectStore.queryByYonQL(pigIsOne, "developplatform");
        if (pigIsOneres.length == 0) {
          var err = "  -- 猪舍编码:" + Housecodes + "不存在,请检查 --  ";
          throw new Error(err);
        }
        //查询猪舍数据库获取猪舍id
        var PigHouseId = pigIsOneres[0].id;
        //生产线
        var Beltline = datas[i].Beltline;
        //猪只类型
        var PigType = datas[i].Pig_Type;
        PigType = PigType + "";
        if (PigType == undefined || PigType == "") {
          throw new Error("【猪只类型是必填项】");
        }
        if (PigType != "1" && PigType != "2" && PigType != "3" && PigType != "4" && PigType != "5" && PigType != "6" && PigType != "7" && PigType != "8" && PigType != "9") {
          var err = "  【请输入正确猪只类型枚举值】  ";
          throw new Error(err);
        }
        //期初存栏
        var Qchu = datas[i].Qchu;
        //当日转入
        var Enter = datas[i].Enter;
        //当日转出
        var Out = datas[i].Out;
        //期末存栏
        var Finals = datas[i].Final;
        //唯一
        var onlyValue = Dates + "-" + Batchnumb + "-" + Housecode + "-" + PigType;
        var ss = getData(onlyValue);
        if (ss != undefined) {
          var err = "日期为:" + Dates + ",猪舍编码:" + Housecode + ",批次号为:" + Batchnumb + "已经存在";
          throw new Error(err);
        }
        var body = {
          org_id: orgids,
          jituanmingchen: Groupname,
          farengongsi: Company,
          zhuchang: farmid,
          tongjiriqi: Dates,
          picihao: Batchnumb,
          zhushe: PigHouseId,
          shengchanxian: Beltline,
          zhuzhileixing: PigType,
          qichucunlan: Qchu,
          dangrizhuanru: Enter,
          dangrizhuanchu: Out,
          qimocunlan: Finals
        };
        objectI.push(body);
      } else if (statusC == "Update") {
        //集团名称
        var Groupname = datas[i].Group_name;
        if (Groupname == undefined || Groupname == "") {
          throw new Error("【集团名称是必填项】");
        }
        //法人公司
        var Company = datas[i].Company;
        if (Company == undefined || Company == "") {
          throw new Error("【法人公司字段是必填项】");
        }
        //猪场code
        var PigCodes = datas[i].Pig_Code;
        if (PigCodes == undefined || PigCodes == "") {
          throw new Error("【猪场编码是必填项】");
        }
        var pigcode = "select id from AT17604A341D580008.AT17604A341D580008.pigFarm where pig_Code = '" + PigCodes + "' and dr =0";
        var pigCoderes = ObjectStore.queryByYonQL(pigcode, "developplatform");
        if (pigCoderes.length == 0) {
          var err = "  -- 猪场编码:" + PigCodes + "不存在,请检查 --  ";
          throw new Error(err);
        }
        //查询猪场数据库获取猪场id
        var farmid = pigCoderes[0].id;
        //统计日期
        var Dates = datas[i].Date;
        if (Dates == undefined || Dates == "") {
          throw new Error("【统计日期是必填项】");
        }
        //批次号
        var Batchnumb = datas[i].Batch_numb;
        if (Batchnumb == undefined || Batchnumb == "") {
          throw new Error("【批次号是必填项】");
        }
        //猪舍code
        var Housecode = datas[i].House_code;
        var Housecodes = Housecode + "";
        if (Housecodes == undefined || Housecodes == "") {
          throw new Error("【猪舍编码是必填项】");
        }
        var pigIsOne = "select id from AT17604A341D580008.AT17604A341D580008.hogHouse where house_code = '" + Housecodes + "' and dr =0";
        var pigIsOneres = ObjectStore.queryByYonQL(pigIsOne, "developplatform");
        if (pigIsOneres.length == 0) {
          var err = "  -- 猪舍编码:" + Housecodes + "不存在,请检查 --  ";
          throw new Error(err);
        }
        //查询猪舍数据库获取猪舍id
        var PigHouseId = pigIsOneres[0].id;
        //生产线
        var Beltline = datas[i].Beltline;
        //猪只类型
        var PigType = datas[i].Pig_Type;
        PigType = PigType + "";
        if (PigType == undefined || PigType == "") {
          throw new Error("【猪只类型是必填项】");
        }
        if (PigType != "1" && PigType != "2" && PigType != "3" && PigType != "4" && PigType != "5" && PigType != "6" && PigType != "7" && PigType != "8" && PigType != "9") {
          var err = "  【请输入正确猪只类型枚举值】  ";
          throw new Error(err);
        }
        //期初存栏
        var Qchu = datas[i].Qchu;
        //当日转入
        var Enter = datas[i].Enter;
        //当日转出
        var Out = datas[i].Out;
        //期末存栏
        var Finals = datas[i].Final;
        var onlyValue = Dates + "-" + Batchnumb + "-" + Housecode + "-" + PigType;
        var ss = getData(onlyValue);
        if (ss == undefined) {
          var err = "日期为:" + Dates + ",猪舍编码:" + Housecode + ",批次号为:" + Batchnumb + ",猪只类型枚举值为:" + PigType + ",不存在无法修改";
          throw new Error(err);
        }
        var SerialID = ss.ricunlanID;
        var body = {
          id: SerialID,
          org_id: orgids,
          jituanmingchen: Groupname,
          farengongsi: Company,
          zhuchang: farmid,
          tongjiriqi: Dates,
          picihao: Batchnumb,
          zhushe: PigHouseId,
          shengchanxian: Beltline,
          zhuzhileixing: PigType,
          qichucunlan: Qchu,
          dangrizhuanru: Enter,
          dangrizhuanchu: Out,
          qimocunlan: Finals
        };
        objectU.push(body);
      } else {
        var err = "  -- 操作标识:" + statusC + "输入有误,请检查 --  ";
        throw new Error(err);
      }
    }
    //修改
    var res1 = ObjectStore.updateBatch("AT17604A341D580008.AT17604A341D580008.batchColumn", objectU, "batchColumn");
    //新增
    var res2 = ObjectStore.insertBatch("AT17604A341D580008.AT17604A341D580008.batchColumn", objectI, "batchColumn");
    return { Update: res1, Insert: res2 };
    function getData(value) {
      var body = [];
      var map = new Map();
      var sql = "select tongjiriqi,picihao,zhushe,zhuzhileixing,id from AT17604A341D580008.AT17604A341D580008.batchColumn";
      var res = ObjectStore.queryByYonQL(sql, "developplatform");
      if (res.length === 0) {
        return null;
      }
      for (var t1 = 0; t1 < res.length; t1++) {
        var date = res[t1].tongjiriqi;
        var pch1 = res[t1].picihao;
        var zsid = res[t1].zhushe;
        if (zsid == null) {
          continue;
        }
        var zsSql = "select house_code from AT17604A341D580008.AT17604A341D580008.hogHouse where id = '" + zsid + "'";
        var zsRes = ObjectStore.queryByYonQL(zsSql, "developplatform");
        var zsCode = zsRes[0].house_code;
        var zzlx1 = res[t1].zhuzhileixing;
        var rclID = res[t1].id; //日存栏id
        var latitude = date + "-" + pch1 + "-" + zsCode + "-" + zzlx1;
        map = {
          latitude,
          rclID
        };
        body.push(map);
      }
      for (var t2 = 0; t2 < body.length; t2++) {
        //纬度
        var latitudes = body[t2].latitude;
        //日存栏ID
        var ricunlanID = body[t2].rclID;
        if (latitudes === value) {
          return { ricunlanID };
        } else {
          continue;
        }
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });