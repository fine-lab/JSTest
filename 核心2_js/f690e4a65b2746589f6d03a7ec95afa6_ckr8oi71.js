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
        //业务流水码(唯一)
        var SerialCode = datas[i].Serial_code;
        SerialCode = SerialCode + "";
        if (SerialCode == undefined || SerialCode == "") {
          throw new Error("【业务流水码是必填项】");
        }
        var SerialSql = "select * from AT17604A341D580008.AT17604A341D580008.batchChangeTable where yewuliushuima = '" + SerialCode + "' and dr =0";
        var Serialres = ObjectStore.queryByYonQL(SerialSql, "developplatform");
        if (Serialres.length != 0) {
          var err = "  【 业务流水码:" + SerialCode + "已经存在,请检查 】  ";
          throw new Error(err);
        }
        //猪场编码
        var BusinessField = datas[i].Business_Field;
        if (BusinessField == undefined || BusinessField == "") {
          throw new Error("【业务流水码是必填项】");
        }
        var pigcode = "select * from AT17604A341D580008.AT17604A341D580008.pigFarm where pig_Code = '" + BusinessField + "' and dr =0";
        var pigCoderes = ObjectStore.queryByYonQL(pigcode, "developplatform");
        if (pigCoderes.length == 0) {
          var err = "  【 猪场编码:" + BusinessField + "不存在,请检查 】  ";
          throw new Error(err);
        }
        //查询猪场数据库获取猪场id
        var farmid = pigCoderes[0].id;
        //业务类型
        var BusinessType = datas[i].Business_Type;
        BusinessType = BusinessType + "";
        if (BusinessType == undefined || BusinessType == "") {
          throw new Error("【业务类型是必填项】");
        }
        if (
          BusinessType != "1" &&
          BusinessType != "2" &&
          BusinessType != "3" &&
          BusinessType != "4" &&
          BusinessType != "5" &&
          BusinessType != "6" &&
          BusinessType != "7" &&
          BusinessType != "8" &&
          BusinessType != "9" &&
          BusinessType != "10" &&
          BusinessType != "11" &&
          BusinessType != "12" &&
          BusinessType != "13" &&
          BusinessType != "14" &&
          BusinessType != "15" &&
          BusinessType != "16" &&
          BusinessType != "17" &&
          BusinessType != "18" &&
          BusinessType != "19" &&
          BusinessType != "20"
        ) {
          var err = "  【请输入正确业务类型枚举值】  ";
          throw new Error(err);
        }
        //变动类型
        var ChangeType = datas[i].Change_Type;
        ChangeType = ChangeType + "";
        if (ChangeType == undefined || ChangeType == "") {
          throw new Error("【变动类型是必填项】");
        }
        if (ChangeType != "1" && ChangeType != "2") {
          var err = "  【请输入正确变动类型枚举值】  ";
          throw new Error(err);
        }
        //生产记录
        var ProductionRecords = datas[i].Production_Records;
        ProductionRecords = ProductionRecords + "";
        if (ProductionRecords == undefined || ProductionRecords == "") {
          throw new Error("【生产记录是必填项】");
        }
        //业务日期
        var BusinessDate = datas[i].Business_Date;
        if (BusinessDate == undefined || BusinessDate == "") {
          throw new Error("【业务日期是必填项】");
        }
        //猪舍编码
        var PigHouse = datas[i].Pig_House;
        if (PigHouse == undefined || PigHouse == "") {
          throw new Error("【猪舍编码是必填项】");
        }
        var pigIsOne = "select * from AT17604A341D580008.AT17604A341D580008.hogHouse where house_code = '" + PigHouse + "' and dr =0";
        var pigIsOneres = ObjectStore.queryByYonQL(pigIsOne, "developplatform");
        if (pigIsOneres.length == 0) {
          var err = "  【 猪舍编码:" + PigHouse + "不存在,请检查 】  ";
          throw new Error(err);
        }
        //查询猪舍数据库获取猪舍id
        var PigHouseId = pigIsOneres[0].id;
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
        //批次号
        var Batchnumb = datas[i].Batch_numb;
        Batchnumb = Batchnumb + "";
        if (Batchnumb == undefined || Batchnumb == "") {
          throw new Error("【批次号是必填项】");
        }
        //变动头数
        var Changenumb = datas[i].Change_numb;
        if (0 > Changenumb) {
          throw new Error("【变动头数不能小于0】");
        }
        //变动重量
        var Changeweight = datas[i].Change_weight;
        if (0 > Changeweight) {
          throw new Error("【变动重量不能小于0】");
        }
        //种猪耳号
        var Earnumb = datas[i].Ear_numb;
        var body = {
          org_id: orgids,
          zhuchang: farmid,
          yewuleixing: BusinessType,
          biandongleixing: ChangeType,
          shengchanjilu: ProductionRecords,
          yewuriqi: BusinessDate,
          zhushe: PigHouseId,
          zhuzhileixing: PigType,
          picihao: Batchnumb,
          biandongtoushu: Changenumb,
          biandongzhongliang: Changeweight,
          zhongzhuerhao: Earnumb,
          yewuliushuima: SerialCode
        };
        objectI.push(body);
      } else if (statusC == "Update") {
        //业务流水码(唯一)
        var SerialCode = datas[i].Serial_code;
        SerialCode = SerialCode + "";
        if (SerialCode == undefined || SerialCode == "") {
          throw new Error("【业务流水码是必填项】");
        }
        var SerialSql = "select * from AT17604A341D580008.AT17604A341D580008.batchChangeTable where yewuliushuima = '" + SerialCode + "' and dr =0";
        var Serialres = ObjectStore.queryByYonQL(SerialSql, "developplatform");
        if (Serialres.length == 0) {
          var err = "  【 业务流水码:" + SerialCode + "不存在,无法修改 】  ";
          throw new Error(err);
        }
        //查出来修改的id
        var SerialID = Serialres[0].id;
        //猪场编码
        var BusinessField = datas[i].Business_Field;
        if (BusinessField == undefined || BusinessField == "") {
          throw new Error("【业务流水码是必填项】");
        }
        var pigcode = "select * from AT17604A341D580008.AT17604A341D580008.pigFarm where pig_Code = '" + BusinessField + "' and dr =0";
        var pigCoderes = ObjectStore.queryByYonQL(pigcode, "developplatform");
        if (pigCoderes.length == 0) {
          var err = "  【 猪场编码:" + BusinessField + "不存在,请检查 】  ";
          throw new Error(err);
        }
        //查询猪场数据库获取猪场id
        var farmid = pigCoderes[0].id;
        //业务类型
        var BusinessType = datas[i].Business_Type;
        BusinessType = BusinessType + "";
        if (BusinessType == undefined || BusinessType == "") {
          throw new Error("【业务类型是必填项】");
        }
        if (
          BusinessType != "1" &&
          BusinessType != "2" &&
          BusinessType != "3" &&
          BusinessType != "4" &&
          BusinessType != "5" &&
          BusinessType != "6" &&
          BusinessType != "7" &&
          BusinessType != "8" &&
          BusinessType != "9" &&
          BusinessType != "10" &&
          BusinessType != "11" &&
          BusinessType != "12" &&
          BusinessType != "13" &&
          BusinessType != "14" &&
          BusinessType != "15" &&
          BusinessType != "16" &&
          BusinessType != "17" &&
          BusinessType != "18" &&
          BusinessType != "19" &&
          BusinessType != "20"
        ) {
          var err = "  【请输入正确业务类型枚举值】  ";
          throw new Error(err);
        }
        //变动类型
        var ChangeType = datas[i].Change_Type;
        ChangeType = ChangeType + "";
        if (ChangeType == undefined || ChangeType == "") {
          throw new Error("【变动类型是必填项】");
        }
        if (ChangeType != "1" && ChangeType != "2") {
          var err = "  【请输入正确变动类型枚举值】  ";
          throw new Error(err);
        }
        //生产记录
        var ProductionRecords = datas[i].Production_Records;
        ProductionRecords = ProductionRecords + "";
        if (ProductionRecords == undefined || ProductionRecords == "") {
          throw new Error("【生产记录是必填项】");
        }
        //业务日期
        var BusinessDate = datas[i].Business_Date;
        if (BusinessDate == undefined || BusinessDate == "") {
          throw new Error("【业务日期是必填项】");
        }
        //猪舍编码
        var PigHouse = datas[i].Pig_House;
        if (PigHouse == undefined || PigHouse == "") {
          throw new Error("【猪舍编码是必填项】");
        }
        var pigIsOne = "select * from AT17604A341D580008.AT17604A341D580008.hogHouse where house_code = '" + PigHouse + "' and dr =0";
        var pigIsOneres = ObjectStore.queryByYonQL(pigIsOne, "developplatform");
        if (pigIsOneres.length == 0) {
          var err = "  【 猪舍编码:" + PigHouse + "不存在,请检查 】  ";
          throw new Error(err);
        }
        //查询猪舍数据库获取猪舍id
        var PigHouseId = pigIsOneres[0].id;
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
        //批次号
        var Batchnumb = datas[i].Batch_numb;
        Batchnumb = Batchnumb + "";
        if (Batchnumb == undefined || Batchnumb == "") {
          throw new Error("【批次号是必填项】");
        }
        //变动头数
        var Changenumb = datas[i].Change_numb;
        if (0 > Changenumb) {
          throw new Error("【变动头数不能小于0】");
        }
        //变动重量
        var Changeweight = datas[i].Change_weight;
        if (0 > Changeweight) {
          throw new Error("【变动重量不能小于0】");
        }
        //种猪耳号
        var Earnumb = datas[i].Ear_numb;
        var body = {
          id: SerialID,
          org_id: orgids,
          zhuchang: farmid,
          yewuleixing: BusinessType,
          biandongleixing: ChangeType,
          shengchanjilu: ProductionRecords,
          yewuriqi: BusinessDate,
          zhushe: PigHouseId,
          zhuzhileixing: PigType,
          picihao: Batchnumb,
          biandongtoushu: Changenumb,
          biandongzhongliang: Changeweight,
          zhongzhuerhao: Earnumb,
          yewuliushuima: SerialCode
        };
        objectU.push(body);
      } else {
        var err = "  -- 操作标识:" + statusC + "输入有误,请检查 --  ";
        throw new Error(err);
      }
    }
    //修改
    var res1 = ObjectStore.updateBatch("AT17604A341D580008.AT17604A341D580008.batchChangeTable", objectU, "batchChangeTable");
    //新增
    var res2 = ObjectStore.insertBatch("AT17604A341D580008.AT17604A341D580008.batchChangeTable", objectI, "batchChangeTable");
    //生成其他出库
    let OutWraehouseparam = { key: objectI };
    let OutWarehousefunc = extrequire("AT17604A341D580008.hd03.outWarehouse");
    let OutWarehouseRes = OutWarehousefunc.execute(null, OutWraehouseparam);
    //生成形态转换
    let param = { key: objectI };
    let func = extrequire("AT17604A341D580008.hd03.morphologicalZH");
    let res = func.execute(null, param);
    return { Update: res1, Insert: res2 };
  }
}
exports({ entryPoint: MyAPIHandler });