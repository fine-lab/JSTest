let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    for (var i = 0; i < param.data.length; i++) {
      let id = param.data[i].id;
      let biaoti = "";
      if (
        param.data[i] != undefined &&
        param.data[i] != null &&
        param.data[i] != "" &&
        param.data[i].storeProRecords != undefined &&
        param.data[i].storeProRecords != null &&
        param.data[i].storeProRecords != ""
      ) {
        biaoti = param.data[i].storeProRecords;
      } else {
        let bodyCprk = {};
        let urlCprk = "https://www.example.com/" + id;
        let apiResponseCprk = openLinker("GET", urlCprk, "ST", JSON.stringify(bodyCprk));
        apiResponseCprk = JSON.parse(apiResponseCprk);
        console.log("查询出来的api详情信息" + JSON.stringify(apiResponseCprk));
        if (apiResponseCprk.data.storeProRecords == undefined && apiResponseCprk.data.storeProRecords.length == 0) {
          throw new Error("没有找到产品入库单对应的详情信息，请联系相关开发人员！");
        }
        biaoti = apiResponseCprk.data.storeProRecords;
      }
      let biaotiListOms = "";
      for (var a = 0; a < biaoti.length; a++) {
        //根据物料分类id查询出物料分类编码
        let wlflSql = "select id,code,name from pc.cls.ManagementClass where id=" + biaoti[a].productClass;
        var wlflObject = ObjectStore.queryByYonQL(wlflSql, "productcenter");
        //根据物料查询出对应的货品条码
        let wltmSql = "select barCode from pc.product.ProductBarCode where productId=" + biaoti[a].product;
        var wltmObject = ObjectStore.queryByYonQL(wltmSql, "productcenter");
        let barCode = "";
        if (wltmObject.length > 0) {
          barCode = wltmObject[0].barCode;
        }
        //库存状态的判断
        let inventoryType = "";
        if (biaoti[a].stockStatusDoc_name != undefined && (biaoti[a].stockStatusDoc_name == "合格" || biaoti[a].stockStatusDoc_name == "放行")) {
          inventoryType = "FX";
        } else if (biaoti[a].stockStatusDoc_name != undefined && biaoti[a].stockStatusDoc_name == "待检") {
          inventoryType = "DJ";
        } else if (biaoti[a].stockStatusDoc_name != undefined && biaoti[a].stockStatusDoc_name == "禁用") {
          inventoryType = "DISABLE";
        }
        let biaotiOms = {
          orderLineNo: biaoti[a].rowno, //行号
          planQty: biaoti[a].contactsQuantity, //应收数量
          actualQty: biaoti[a].qty, //实收数量
          conversionRate: biaoti[a].invExchRate, //换算率
          inventoryType: inventoryType, //库存状态
          inventoryUnit: biaoti[a].stockUnit_name, //库存单位
          unit: biaoti[a].product_unitName, //单位（主计量）
          itemInfo: {
            itemCode: biaoti[a].productsku_cCode, //货品sku编码
            itemName: biaoti[a].productsku_cName, //货品sku名称
            itemType: wlflObject[0].code, //货品类型编码
            itemTypeName: wlflObject[0].name, //货品类型名称
            barCode: barCode //货品条码
          },
          batchInfos: [
            {
              batchCode: biaoti[a].batchno, //批次号
              productCode: "" //批号
            }
          ]
        };
        biaotiListOms = biaotiListOms + JSON.stringify(biaotiOms) + ",";
      }
      let kczzSql = "select id,code,name from org.func.BaseOrg where id=" + param.data[i].org;
      var kczzObject = ObjectStore.queryByYonQL(kczzSql, "ucf-org-center");
      let wgzzSql = "select id,code,name from org.func.BaseOrg where id=" + param.data[i].factoryOrg;
      var wgzzObject = ObjectStore.queryByYonQL(wgzzSql, "ucf-org-center");
      let bmSql = "select id,code,name from bd.adminOrg.AdminOrgVO where id=" + param.data[i].department;
      var bmObject = ObjectStore.queryByYonQL(bmSql, "ucf-org-center");
      let ckSql = "select id,code,name from aa.warehouse.Warehouse where id=" + param.data[i].warehouse;
      var ckObject = ObjectStore.queryByYonQL(ckSql, "productcenter");
      let time = new Date(new Date().getTime() + 28800000);
      let nian = time.getFullYear();
      let yue = time.getMonth() + 1 < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1;
      let ri = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
      let shi = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
      let fen = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
      let miao = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
      let dateView = nian + "-" + yue + "-" + ri + " " + shi + ":" + fen + ":" + miao;
      let biaotouOms = {
        outBizOrderCode: param.data[i].code, //外部单号
        orderSource: "PLATFORM_SYNC", //来源
        channelCode: "DEFAULT", //渠道
        bizOrderType: "INBOUND", //父单据类型-入库
        subBizOrderType: "CPRK", //子单据类型-生产工单
        ownerCode: kczzObject[0].code, //库存组织编码
        ownerName: kczzObject[0].name, //库存组织
        accountOrgCode: kczzObject[0].code, //库存组织会计主体编码
        accountOrg: kczzObject[0].name, //库存组织会计主体
        departmentCode: bmObject[0].code, //部门编码
        departmentName: bmObject[0].name, //部门名称
        transactionType: param.data[i].bustype_name, //交易类型
        sourcePlatformCode: "YS", //来源平台编码
        sourcePlatformName: "用友", //来源平台名称
        remark: param.data[i].memo, //备注
        completionOrgCode: wgzzObject[0].code, //完工组织编码
        completionOrgName: wgzzObject[0].name, //完工组织名称
        completionAccountOrgCode: wgzzObject[0].code, //完工组织会计主体编码
        completionAccountOrg: wgzzObject[0].name, //完工组织会计主体名称
        warehouseCode: ckObject[0].code, //仓编码
        warehouseName: ckObject[0].name, //仓名称
        orderStatus: "INBOUND", //单据状态
        orderStatusName: "已审核", //单据状态名称
        orderLines: JSON.parse("[" + substring(biaotiListOms, 0, biaotiListOms.length - 1) + "]")
      };
      let bodyOms = {
        appCode: "beiwei-ys", //应用编码
        appApiCode: "cprk.ys.create.interface", //接口编码
        schemeCode: "ys", //方案编码
        jsonBody: biaotouOms
      };
      let headerOms = { "Content-Type": "application/json;charset=UTF-8" };
      let strResponse = postman("POST", "https://www.example.com/", JSON.stringify(headerOms), JSON.stringify(bodyOms));
      strResponse = JSON.parse(strResponse);
      if (!strResponse.success) {
        console.log("产品入库单推送OMS失败" + JSON.stringify(strResponse));
      } else {
        console.log("产品入库单推送OMS成功" + param.data[i].code);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });