let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取页面传参对象
    var verifystate = request.verifystate;
    if (verifystate == 2) {
      throw new Error("已审核的停售单不允许修改！");
    }
    // 获取前缀与公共信息
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let queryCurrentStockUrl = apiPreAndAppCode.apiPrefix + "/yonbip/scm/stock/QueryCurrentStocksByCondition"; // 现存量查询
    let queryLocalCurrentStockUrl = apiPreAndAppCode.apiPrefix + "/yonbip/scm/locationstockanalysis/list"; // 货位现存量查询
    let appCode = apiPreAndAppCode.appCode;
    let orgId = request.org_id;
    var stockStatusDoc = "";
    let sql = "select id,code,statusName from st.stockStatusRecord.stockStatusRecord where statusName ='合格'";
    var list = ObjectStore.queryByYonQL(sql, "ustock");
    if (list.length > 0) {
      stockStatusDoc = list[0].id;
    } else {
      throw new Error("查询库存状态失败，请稍后重试！");
    }
    // 以下是表体校验
    // 获取表体，但是存在表体不变后端函数获取到空的情况
    var detaillist = request.detaillist;
    // 校验是不是存在相同的物料或已审批，或者开立态 (若动作为修改，则需要去掉当前行)
    if (detaillist == "undefined" || detaillist.length == 0) {
      // 若表体没有变化直接返回
      return {};
    }
    if (detaillist.length > 10) {
      throw new Error("最大允许停售记录为10条！");
    }
    var errors = [];
    var currentMap = {};
    // 循环表体
    for (var i = 0; i < detaillist.length; i++) {
      var detail = detaillist[i]; // 循环单条记录
      var isGoodsPosition = detail.isGoodsPosition; // 是否仓位管理
      var isCountiCheck = false; // 跳出该次循环标识
      // 判断批次管理的物料 设置批次必填
      if (detail.isBatchManage == true || detail.isBatchManage == "1") {
        if (detail.batch_no == undefined || detail.batch_no == "" || detail.batch_no == null) {
          errors.push("第" + (i + 1) + "行必须输入批次！");
          isCountiCheck = true;
        }
      } else if (detail.isBatchManage == undefined || detail.isBatchManage == "" || detail.isBatchManage == null) {
        errors.push("第" + (i + 1) + "行药品不存在医药档案！");
        continue;
      }
      // 判断是否仓位管理，设置仓位必填
      if (isGoodsPosition) {
        if (detail.outgoodsposition == null || detail.outgoodsposition == undefined || detail.outgoodsposition == "") {
          errors.push("第" + (i + 1) + "行必须输入货位！ ");
          isCountiCheck = true;
        }
      }
      if (detail.qty <= 0) {
        errors.push("第" + (i + 1) + "行数量必须大于0！ ");
        isCountiCheck = true;
      }
      if (isCountiCheck) {
        continue;
      }
      // 如果仓位管理 判断仓位现存量
      if (isGoodsPosition) {
      } else {
        // 非仓位管理 直接判断现存量
      }
      var tmp = detail.sussku + "|" + detail.warehouse + "|" + detail.batch_no + "|" + detail.outgoodsposition;
      if (currentMap[tmp]) {
        errors.push("第" + (i + 1) + "行和第" + currentMap[tmp] + "行的记录重复！");
      }
      currentMap[tmp] = i + 1; // 将当前行号及批号放入实体
    }
    // 拼装错误返回提示
    if (errors.length > 0) {
      var errStr = "";
      for (var i = 0; i < errors.length; i++) {
        errStr = errStr + (errStr.length == 0 ? "" : "\n");
        errStr = errStr + errors[i];
      }
      return { errInfo: errStr };
    }
    return { flag: true };
  }
}
exports({ entryPoint: MyAPIHandler });