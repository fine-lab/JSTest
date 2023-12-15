let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let resp = [];
    let resp1 = [request];
    var sql1 = "";
    var zyx29 = "";
    var pk_busiman = "";
    var pk_dept = "";
    var def6 = "";
    var cash_item = "";
    var def5 = "";
    var def9 = "";
    var def18 = "";
    var def20 = "";
    var zyx24 = "";
    var zyx28 = "";
    var zyx29 = "";
    try {
      if (request.type == 1 || request.type == "ty") {
        sql1 = " select * from znbzbx.commonexpensebill.CommonExpenseBillVO where code = '" + request.pk_busiman + "' ";
        // 通用报销
        // 查全表
        pk_busiman = ObjectStore.queryByYonQL(sql1, "znbzbx");
        resp = {
          data: pk_busiman,
          quer: request
        };
      } else if (request.type == 2 || request.type == "cl") {
        sql1 = " select * from znbzbx.travelexpensebill.TravelExpenseBillVO where code = '" + request.pk_busiman + "' ";
        // 差旅
        // 查全表
        pk_busiman = ObjectStore.queryByYonQL(sql1, "znbzbx");
        resp = {
          data: pk_busiman,
          quer: request
        };
      } else if (request.type == 3 || request.type == "gr") {
        sql1 = " select * from znbzbx.personalloanbill.PersonalLoanBillVO where code = '" + request.pk_busiman + "' ";
        // 个人借款
        // 查全表
        pk_busiman = ObjectStore.queryByYonQL(sql1, "znbzbx");
        resp = {
          data: pk_busiman,
          quer: request
        };
      } else {
        if (request.pk_busiman != "" && request.pk_busiman != null) {
          sql1 = "select code,id,name from bd.staff.StaffNew where id = '" + request.pk_busiman + "' and dr=0 ";
          // 报销人
          pk_busiman = ObjectStore.queryByYonQL(sql1, "znbzbx");
        }
        if (request.pk_dept != "" && request.pk_dept != null) {
          sql1 = "select code,id,name from bd.customerdoc_NCBM.NCBM where id = '" + request.pk_dept + "' and dr=0";
          pk_dept = ObjectStore.queryByYonQL(sql1, "customerdoc");
        }
        if (request.def5 != "" && request.def5 != null) {
          sql1 = "select code,id,name from	bd.project.ProjectVO where id = '" + request.def5 + "' and dr=0";
          // 项目
          def5 = ObjectStore.queryByYonQL(sql1, "znbzbx");
        }
        if (request.def6 != "" && request.def6 != null) {
          sql1 = "select code,id,name from bd.expenseitem.ExpenseItem where id = '" + request.def6 + "'";
          // 借方科目
          def6 = ObjectStore.queryByYonQL(sql1, "znbzbx");
        }
        if (request.def9 != "" && request.def9 != null) {
          sql1 = "select code,id,name from	bd.customerdoc_LKFK04.LKFK04 where id = '" + request.def9 + "' and dr=0";
          // 研发项目
          def9 = ObjectStore.queryByYonQL(sql1, "customerdoc");
        }
        if (request.def18 != "" && request.def18 != null) {
          sql1 = "select code,id,name from bd.customerdoc_LKFK31.LKFK31 where id = '" + request.def18 + "'";
          // 研发项目
          def18 = ObjectStore.queryByYonQL(sql1, "customerdoc");
        }
        if (request.def20 != "" && request.def20 != null) {
          sql1 = "select code,id,name from bd.expenseitem.ExpenseItem where id = '" + request.def20 + "'";
          // 研发项目
          def20 = ObjectStore.queryByYonQL(sql1, "znbzbx");
        }
        if (request.cash_item != "" && request.cash_item != null) {
          sql1 = "select code,id,name from bd.customerdoc_LKFK02.LKFK02 where id = '" + request.cash_item + "' and dr=0";
          // 现金流量项目
          cash_item = ObjectStore.queryByYonQL(sql1, "customerdoc");
        }
        if (request.zyx24 != "" && request.zyx24 != null) {
          sql1 = "select code,id,name from bd.customerdoc_NCBM.NCBM where id = '" + request.zyx24 + "' and dr=0";
          zyx24 = ObjectStore.queryByYonQL(sql1, "customerdoc");
        }
        if (request.zyx28 != "" && request.zyx28 != null) {
          sql1 = "select code,id,name from	bd.customerdoc_LKFK10.LKFK10 where id = '" + request.zyx28 + "' and dr=0";
          // 在建工程
          zyx28 = ObjectStore.queryByYonQL(sql1, "customerdoc");
        }
        if (request.zyx29 != "" && request.zyx29 != null) {
          sql1 = "select code,id,name from bd.customerdoc_LKFK11.LKFK11 where id = '" + request.zyx29 + "' and dr=0";
          // 资金来源
          zyx29 = ObjectStore.queryByYonQL(sql1, "customerdoc");
        }
        resp = {
          pk_busiman: pk_busiman,
          def6: def6,
          cash_item: cash_item,
          def5: def5,
          def9: def9,
          def20: def20,
          zyx24: zyx24,
          zyx28: zyx28,
          zyx29: zyx29,
          pk_dept: pk_dept,
          def18: def18,
          data: request
        };
      }
    } catch (e) {
      resp = {
        cdoe: "999",
        errorlog: e,
        errorsql: sql1,
        josnquert: request
      };
    }
    return resp;
  }
}
exports({ entryPoint: MyAPIHandler });