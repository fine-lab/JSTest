let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = {
      ziduan1: request.project_no,
      ziduan2: request.contract_no,
      baogaobianma: request.report_no,
      ziduan4: request.detection_object,
      jiancecanshu: request.detection_param.length > 200 ? substring(request.detection_param, 0, 200) : request.detection_param,
      jiancefangfa: request.detection_method,
      jianceshuliang: request.detection_num,
      jiancekaishiri: request.detection_startDate,
      jiancejieshuri: request.detection_endDate,
      baogaori: request.report_date,
      baogaojine: request.report_money,
      qianshouri: request.signing_date,
      qianshoufang: request.signed,
      fasongfangshi: request.distribution_method,
      kuaididanhao: request.courier_number,
      dept_code: request.dept_code,
      dept_name: request.dept_name,
      isEnd: request.isEnd == undefined ? "2" : request.isEnd,
      document_status: request.document_status, // 单据状态
      update_data: request.update_data, //更新日期
      isCost: "2",
      shifuyishengchengyingshoudan: "false"
    };
    // 查询报告单单据状态为：原始报告或已更新状态的报告单（1、4）：
    var querySql =
      " select id,baogaobianma from GT59740AT1.GT59740AT1.RJ001 where ziduan2='" +
      request.contract_no +
      "' and  baogaobianma='" +
      request.report_no +
      "' and baogaojine='" +
      request.report_money +
      "' and dept_code='" +
      request.dept_code +
      "' and baogaori='" +
      request.report_date +
      "' and qianshouri='" +
      request.signing_date +
      "' and document_status in (" +
      "'" +
      1 +
      "'," +
      "'" +
      4 +
      "')";
    var isHave = ObjectStore.queryByYonQL(querySql);
    var querySql1 =
      " select id,baogaobianma,baogaojine,dept_name,dept_code,baogaori,qianshouri,update_data from	GT59740AT1.GT59740AT1.RJ001 where baogaobianma='" +
      request.report_no +
      "' and document_status in (" +
      "'" +
      1 +
      "'," +
      "'" +
      4 +
      "') order by pubts desc";
    var isHave1 = ObjectStore.queryByYonQL(querySql1);
    var res = "";
    if (isHave.length == 0) {
      // 单据不存在或金额被修改过
      if (isHave1.length == 0) {
        // 报告不存在，新增-单据状态为原始报告
        object.document_status = "1";
        object.isValid = "1";
        let resYsbg = ObjectStore.insert("GT59740AT1.GT59740AT1.RJ001", object, "c5905fec");
        if (resYsbg != undefined) {
          res = {
            code: 200,
            data: resYsbg
          };
        } else {
          res = {
            code: 999,
            message: "新增报告失败，请重试"
          };
        }
        return res;
      } else {
        // 生成新的报告（已更新状态）
        object.document_status = "4"; // 报告单据状态赋值
        object.isValid = "1";
        let resGxbg = ObjectStore.insert("GT59740AT1.GT59740AT1.RJ001", object, "c5905fec");
        if (resGxbg == undefined) {
          res = {
            code: 999,
            message: "生成更新状态报告失败，请重试"
          };
          return res;
        }
        // 生成红字冲销报告,并在更新日字段赋值
        let oldJine = isHave1[0].baogaojine; // 原始报告金额
        let oldDept_name = isHave1[0].dept_name; // 原始报告单据部门名称
        let oldDept_code = isHave1[0].dept_code; // 原始报告单据部门code
        let oldBaoGaoRi = isHave1[0].baogaori; // 原始单据报告日
        let oldQianShouRi = isHave1[0].qianshouri; // 原始单据签收日
        let oldUpdate_data = isHave1[0].update_data != undefined ? isHave1[0].update_data : undefined; // 原始单据更新日
        object.document_status = "3"; // 报告单据状态赋值
        object.baogaojine = -oldJine; // 报告金额取反-按照原来存在报告的金额取反
        object.dept_name = oldDept_name;
        object.dept_code = oldDept_code;
        object.baogaori = oldBaoGaoRi;
        object.qianshouri = oldQianShouRi;
        object.id = undefined;
        object.isValid = "2";
        let resCxbg = ObjectStore.insert("GT59740AT1.GT59740AT1.RJ001", object, "c5905fec");
        if (resCxbg == undefined) {
          res = {
            code: 999,
            message: "生成红字冲销报告失败，请重试"
          };
          return res;
        }
        // 单据存在，金额.部门，报告日，签收日等修改了-修改原先单据状态为已作废
        let updateObject = {};
        updateObject.id = isHave1[0].id;
        updateObject.isValid = "2";
        let resZfbg = ObjectStore.updateById("GT59740AT1.GT59740AT1.RJ001", updateObject, "c5905fec");
        if (resZfbg == undefined) {
          res = {
            code: 999,
            message: "更新原始报告单或已更新报告单单据状态为已作废失败，请重试"
          };
          return res;
        } else {
          res = {
            code: 200,
            data: resZfbg
          };
        }
        return res;
      }
    }
    res = {
      code: 200,
      message: "未找到需要更新的报告单据"
    };
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });