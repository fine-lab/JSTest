let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 勋章信息
    let medals = request.medals;
    // 人员列表
    let staffList = request.staffList;
    // 适用部门
    let deptId = medals.applicable_dept;
    // 勋章id
    let medalsId = medals.id;
    // 勋章图标
    let medalsImg = medals.medal_img;
    // 勋章积分
    let medalsScore = medals.medal_score;
    // 价值观id
    let valuesType = medals.values_type;
    // 价值观分值
    let valuesVal = medals.values_val;
    // 人员id数组
    let staffIds = [];
    for (var i = 0; i < staffList.length; i++) {
      let staff = staffList[i];
      staffIds.push(staff.id);
    }
    // 查询价值观信息
    let ValuesVOs = ObjectStore.queryByYonQL("select * from AT165369EC09000003.AT165369EC09000003.values_manage where id = " + valuesType);
    if (!ValuesVOs || ValuesVOs.length <= 0) {
      return { result: "1", message: "价值观管理档案丢失，请检查价值观管理！" };
    }
    let valuesEnum = ValuesVOs[0].values_type;
    // 查询人员信息
    let staffHMap = {};
    let staffIdMap = {};
    var staffHVOs = ObjectStore.queryByYonQL("select * from AT165369EC09000003.AT165369EC09000003.personal_stats where staff in (" + staffIds + ")");
    if (staffHVOs && staffHVOs.length > 0) {
      for (let i = 0; i < staffHVOs.length; i++) {
        let staffHVO = staffHVOs[i];
        staffIdMap[staffHVO.staff] = staffHVO.id;
        staffHMap[staffHVO.staff] = staffHVO;
      }
    }
    // 查询勋章墙信息
    let staffMedalsMap = {};
    var staffMedalsVOs = ObjectStore.queryByYonQL("select * from AT165369EC09000003.AT165369EC09000003.medals_wall where medal = " + medalsId + " and staff in (" + staffIds + ")");
    if (staffMedalsVOs && staffMedalsVOs.length > 0) {
      for (let i = 0; i < staffMedalsVOs.length; i++) {
        let staffMedalsVO = staffMedalsVOs[i];
        staffMedalsMap[staffMedalsVO.staff] = staffMedalsVO;
      }
    }
    // 价值观信息
    let staffValuesMap = {};
    var staffValuesVOs = ObjectStore.queryByYonQL("select * from AT165369EC09000003.AT165369EC09000003.individual_value where values_type = " + valuesEnum + " and staff in (" + staffIds + ")");
    if (staffValuesVOs && staffValuesVOs.length > 0) {
      for (let i = 0; i < staffValuesVOs.length; i++) {
        let staffValuesVO = staffValuesVOs[i];
        staffValuesMap[staffValuesVO.staff] = staffValuesVO;
      }
    }
    // 处理人员信息
    let updateStaffList = [];
    let insertStaffList = [];
    for (var i = 0; i < staffList.length; i++) {
      let staff = staffList[i];
      let staffHVO = staffHMap[staff.id];
      let newStaffHVO = {};
      if (!staffHVO) {
        newStaffHVO["staff"] = staff.id;
        newStaffHVO["staffname"] = staff.name;
        newStaffHVO["dept"] = deptId;
        newStaffHVO["score"] = medalsScore;
        insertStaffList.push(newStaffHVO);
      } else {
        newStaffHVO["id"] = staffHVO.id;
        newStaffHVO["score"] = staffHVO.score + medalsScore;
        updateStaffList.push(newStaffHVO);
      }
    }
    if (insertStaffList.length > 0) {
      let staffHVOInsert = ObjectStore.insertBatch("AT165369EC09000003.AT165369EC09000003.personal_stats", insertStaffList, "c3e2b3f3");
      for (let i = 0; i < staffHVOInsert.length; i++) {
        let newStaffInsert = staffHVOInsert[i];
        staffIdMap[newStaffInsert.staff] = newStaffInsert.id;
      }
    }
    if (updateStaffList.length > 0) {
      let staffHVOUpdate = ObjectStore.updateBatch("AT165369EC09000003.AT165369EC09000003.personal_stats", updateStaffList, "c3e2b3f3");
    }
    // 处理勋章墙与价值观信息
    let updateMedalsList = [];
    let insertMedalsList = [];
    let updateValuesList = [];
    let insertValuesList = [];
    for (var i = 0; i < staffList.length; i++) {
      let staff = staffList[i];
      let staffId = staff.id;
      let staffVOid = staffIdMap[staffId];
      // 判断是否已有勋章墙记录
      let staffMedalsVO = staffMedalsMap[staffId];
      let newStaffMedalsVO = {};
      if (!staffMedalsVO) {
        newStaffMedalsVO["medal"] = medalsId;
        newStaffMedalsVO["medal_img"] = medalsImg;
        newStaffMedalsVO["medal_number"] = 1;
        newStaffMedalsVO["staff"] = staffId;
        newStaffMedalsVO["dept"] = deptId;
        newStaffMedalsVO["personal_stats_id"] = staffVOid;
        insertMedalsList.push(newStaffMedalsVO);
      } else {
        newStaffMedalsVO["id"] = staffMedalsVO.id;
        newStaffMedalsVO["medal_number"] = staffMedalsVO.medal_number + 1;
        updateMedalsList.push(newStaffMedalsVO);
      }
      // 判断是否已有价值观记录
      let staffValuesVO = staffValuesMap[staffId];
      let newStaffValuesVO = {};
      if (!staffValuesVO) {
        newStaffValuesVO["values_type"] = valuesEnum;
        newStaffValuesVO["values_total"] = valuesVal;
        newStaffValuesVO["staff"] = staffId;
        newStaffValuesVO["dept"] = deptId;
        newStaffValuesVO["personal_stats_id"] = staffVOid;
        insertValuesList.push(newStaffValuesVO);
      } else {
        newStaffValuesVO["id"] = staffValuesVO.id;
        newStaffValuesVO["values_total"] = staffValuesVO.values_total + valuesVal;
        updateValuesList.push(newStaffValuesVO);
      }
    }
    // 更新勋章墙信息
    if (insertMedalsList.length > 0) {
      ObjectStore.insertBatch("AT165369EC09000003.AT165369EC09000003.medals_wall", insertMedalsList, "9bea21dc");
    }
    if (updateMedalsList.length > 0) {
      ObjectStore.updateBatch("AT165369EC09000003.AT165369EC09000003.medals_wall", updateMedalsList, "9bea21dc");
    }
    // 更新价值观信息
    if (insertValuesList.length > 0) {
      ObjectStore.insertBatch("AT165369EC09000003.AT165369EC09000003.individual_value", insertValuesList, "fa442ae0");
    }
    if (updateValuesList.length > 0) {
      ObjectStore.updateBatch("AT165369EC09000003.AT165369EC09000003.individual_value", updateValuesList, "fa442ae0");
    }
    return { result: "0", message: "处理人员信息成功！" };
  }
}
exports({ entryPoint: MyAPIHandler });