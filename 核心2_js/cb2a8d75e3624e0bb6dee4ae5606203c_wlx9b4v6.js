let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    //判断当前流程是否为最后一级审批人
    if (processStateChangeMessage.processEnd === true) {
      var businessKey = processStateChangeMessage.businessKey;
      var id = businessKey.substring(businessKey.lastIndexOf("_") + 1);
      //查询出证合同数据
      var quersql = "select * from GT60601AT58.GT60601AT58.issuingContract	where id=" + id;
      var res = ObjectStore.queryByYonQL(quersql);
      //依据人才库查询收证合同
      var querrckQql = "select * from GT60601AT58.GT60601AT58.personDepotArchives	where id=" + res[0].receiContract_code;
      var rckRes = ObjectStore.queryByYonQL(querrckQql);
      //回写收证合同状态
      var upateSzhtobject = { id: rckRes[0].receiContract_code, vstate: res[0].issuingContract_status };
      ObjectStore.updateById("GT60601AT58.GT60601AT58.certReceiContract", upateSzhtobject, "301cb08a");
      //回写人才库主表信息
      var upateHobject = { id: res[0].receiContract_code, cerStatus: res[0].issuingContract_status };
      ObjectStore.updateById("GT60601AT58.GT60601AT58.personDepotArchives", upateHobject, "207c857b");
      //回写人才库轨迹信息
      var object = {
        issuingContract_code: id,
        issuingContract_status: 2,
        issuingUser: res[0].issuingUser,
        issuing_amount: res[0].issuing_amount,
        registrationPlace: res[0].registrationPlace,
        registrationPlace_remarks: res[0].registrationPlace_remarks,
        issuing_enterprise: res[0].entCenter_code,
        person_charge: res[0].entCenter_creator,
        contract_due_date: res[0].contract_due_date,
        issuing_creator: res[0].creator_userName,
        issuing_division: res[0].division,
        remarks: res[0].remarks,
        issuing_enclosure: res[0].issuing_enclosure,
        issuing_other_enclosure: res[0].issuing_other_enclosure,
        personDepotArchives_id: res[0].receiContract_code
      };
      ObjectStore.insert("GT60601AT58.GT60601AT58.perDepotArchives_c", object, "207c857b");
      //出证使用方为【企业】需回写企业中心子表数据
      if (res[0].issuingUser == 5) {
        //依据企业中心id查询企业中心主表数据
        var querysql = "select * from GT60601AT58.GT60601AT58.enterpriseCenter	where id=" + res[0].entCenter_code;
        var qyzxdata = ObjectStore.queryByYonQL(querysql);
        //回写企业中心合同信息
        var qyzxObject = {
          issuingContract_code: id,
          purpose: qyzxdata[0].purpose,
          cycle: qyzxdata[0].cycle,
          cerType: res[0].cerType,
          cerType_remarks: res[0].cerType_remarks,
          grade: res[0].grade,
          grade_remarks: res[0].grade_remarks,
          major: res[0].major,
          major_remarks: res[0].major_remarks,
          enterpriseCenter_id: res[0].entCenter_code
        };
        ObjectStore.insert("GT60601AT58.GT60601AT58.enterpriseCenter_b", qyzxObject, "60f77db3");
        //查询企业中心合同下的企业需求明细子表信息
        var cerType = res[0].cerType;
        var cerType_remarks = res[0].cerType_remarks;
        var grade = res[0].grade;
        var grade_remarks = res[0].grade_remarks;
        var major = res[0].major;
        var major_remarks = res[0].major_remarks;
        //查询企业中心合同下的企业需求明细子表信息
        var query_asql =
          "select * from GT60601AT58.GT60601AT58.enterpriseCenter_a where enterpriseCenter_id=" + res[0].entCenter_code + " and cerType=" + cerType + " and grade=" + grade + " and major=" + major;
        if (cerType_remarks !== undefined) {
          query_asql = query_asql + " and cerType_remarks='" + cerType_remarks + "'";
        }
        if (grade_remarks !== undefined) {
          query_asql = query_asql + " and grade_remarks='" + grade_remarks + "'";
        }
        if (major_remarks !== undefined) {
          query_asql = query_asql + " and major_remarks='" + major_remarks + "'";
        }
        var qyzx_adata = ObjectStore.queryByYonQL(query_asql);
        if (qyzx_adata.length > 0) {
          //更新企业需求明细
          var qyxqmxObject = { id: qyzx_adata[0].id, quantity: qyzx_adata[0].quantity - 1 };
          ObjectStore.updateById("GT60601AT58.GT60601AT58.enterpriseCenter_a", qyxqmxObject, "60f77db3");
        }
      }
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });