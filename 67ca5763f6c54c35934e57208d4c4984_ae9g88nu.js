let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return;
    let objs = [];
    let updateObjs = [];
    //获取当前用户的身份信息-----------
    let currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    let sysId = "yourIdHere";
    let tenantId = currentUser.tenantId;
    let userids = [currentUser.id];
    let result = listOrgAndDeptByUserIds(sysId, tenantId, userids); //获取当前用户的组织和部门信息
    let resultJSON = JSON.parse(result);
    let staffOfCurrentUser;
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      let userData = resultJSON.data;
      //业务系统员工
      if (userData[currentUser.id] != undefined && userData[currentUser.id] != null) {
        staffOfCurrentUser = userData[currentUser.id];
      }
    }
    if (staffOfCurrentUser == undefined) {
      throw new Error("当前用户未绑定员工，无法自动验收，请关闭自动验收或者绑定员工");
    }
    for (let i = 0; i < param.data.length; i++) {
      let request = { id: param.data[i].id, billMetaNo: "pu.arrivalorder.ArrivalOrder", entryMetaNo: "pu.arrivalorder.ArrivalOrders", entryLinkMetaNo: "mainid" };
      let arrivalInfo = extrequire("PU.publicFunction.getBillAndEntry").execute(request);
      let isGSP = arrivalInfo.extend_is_gsp;
      if (isGSP != 1 && isGSP != "1" && isGSP != true && isGSP != "true") {
        break;
      }
      let orgId = arrivalInfo.inInvoiceOrg;
      let queryGSPParam = "select autoPurInCheck from GT22176AT10.GT22176AT10.SY01_gspmanparamsv3 where org_id = '" + orgId + "' and dr = 0";
      let GSPParamInfo = ObjectStore.queryByYonQL(queryGSPParam, "sy01");
      //如果没有相关配置，或者没有进行相关配置，则跳过
      if (GSPParamInfo == undefined || GSPParamInfo.length == 0) {
        break;
      }
      if (GSPParamInfo[0].autoPurInCheck == undefined || GSPParamInfo[0].autoPurInCheck == 2 || GSPParamInfo[0].autoPurInCheck == "2") {
        break;
      }
      let insertObj = {
        //组织
        org_id: arrivalInfo.inInvoiceOrg,
        //上游单据号
        source_bill_no: arrivalInfo.code,
        //单据状态
        //单据日期
        inspectDate: arrivalInfo.vouchdate,
        //来源组织
        resourceOrg: arrivalInfo.inInvoiceOrg,
        //供应商
        supplier: arrivalInfo.vendor,
        //对方业务员
        salesman: arrivalInfo.extend_saleman,
        //验收员
        inspecter: staffOfCurrentUser.id,
        //部门
        inspectDep: staffOfCurrentUser.deptId,
        //租户id
        tenant_id: tenantId,
        //上游单据id
        source_id: arrivalInfo.id,
        //业务流实例id
        //流程名称
        //上游单据类型
        source_billtype: "PU.pu_arrivalorder",
        //是否审批流控制
        //是否核心单据
        isFlowCoreBill: 1
      };
      insertObj.SY01_purinstockys_lList = [];
      for (let i = 0; i < arrivalInfo.entry.length; i++) {
        let entry = arrivalInfo.entry[i];
        insertObj.SY01_purinstockys_lList.push({
          //批号
          batch_no: entry.batchno,
          gsp_material_type: entry.extend_gsp_protype,
          //规格说明
          description: entry.product_modelDescription,
          sku_code: entry.productsku,
          sku_code_code: entry.productsku_cCode,
          skuname: entry.productsku_cName,
          //通用名
          common_name: entry.extend_common_name,
          //本位码
          bwm: entry.extend_bwm,
          //生产厂家
          manufacturer: entry.extend_produce_factory,
          //仓库id
          warehouse: entry.warehouse,
          //产地
          producingarea: entry.extend_produce_area,
          //商品id
          material: entry.product,
          //包材
          extend_bc: entry.extend_bc,
          //商品分类
          material_type: entry.productClass_Name,
          //单位id
          material_unit: entry.unit,
          //剂型id
          dosageform: entry.extend_dosage_form,
          //规格型号
          specs: entry.product_model,
          //批准文号
          pzwh: entry.extend_approval_number,
          //上市许可持有人
          ssxkcyr: entry.extend_license_holder,
          //检验数量
          //上游单据主表id
          source_id: arrivalInfo.id,
          //上游单据子表id
          sourcechild_id: entry.id,
          //租户id
          tenant_id: tenantId,
          //生产日期
          //有效期至
          //是否二次复核
          //保质期
          //保质期单位
          //验收数量
          checkQty: entry.acceptqty,
          //验收合格数量
          qualifie_qty: entry.acceptqty,
          //验收不合格数量
          unqualifie_qty: 0,
          //验收不合格拒收数量
          refuse_qty: 0,
          //验收不确定
          uncertain_qty: 0,
          //不合格可入库数量
          unQuaNeedInQty: 0
        });
      }
      objs.push(insertObj);
      let updateObj = {
        id: arrivalInfo.id,
        arrivalOrders: []
      };
      for (let i = 0; i < arrivalInfo.entry.length; i++) {
        updateObj.arrivalOrders.push({
          id: arrivalInfo.entry[i].id,
          extend_qualifiedQty: arrivalInfo.entry[i].acceptqty,
          extend_qualified_qty: arrivalInfo.entry[i].acceptqty,
          extend_associate_sample_qty: arrivalInfo.entry[i].acceptqty
        });
      }
      updateObjs.push(updateObj);
    }
    //先批量更新自己，验收数量为实收数量，验收合格数量为实收数量，验收可入库数量为实收数量
    let res2 = ObjectStore.updateBatch("pu.arrivalorder.ArrivalOrder", updateObjs, "pu_arrivalorder");
    let res = openLinker("POST", "https://www.example.com/", "GT22176AT10", JSON.stringify({ objs: objs }));
    return {};
  }
}
exports({ entryPoint: MyTrigger });