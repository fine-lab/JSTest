let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var requestData = request.data;
    let queryCode = requestData.factoryOrderCode;
    let factoryProcessValue = requestData.factoryProcess;
    let processDateValue = requestData.processDate;
    let querySql = "select * from pu.purchaseorder.PurchaseOrderFreeItem where define4=" + queryCode;
    var queryRes = ObjectStore.queryByYonQL(querySql, "upu");
    if (queryRes.length == 0) {
      throw new Error("更新失败，依据参数未查询到可更改的数据！工厂订单号为:【" + queryCode + "】");
    } else if (queryRes.length > 1) {
      throw new Error("更新失败，依据参数查询到多条可更改的数据！工厂订单号为:【" + queryCode + "】");
    } else {
      let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
      let res = func1.execute();
      var token = res.access_token;
      var contenttype = "application/json;charset=UTF-8";
      var message = "";
      var header = {
        "Content-Type": contenttype
      };
      var reqCgdetailurl = "https://www.example.com/" + token + "&id=" + queryRes[0].id;
      let returnData = {};
      var cgResponse = postman("GET", reqCgdetailurl, JSON.stringify(header), null);
      var cgresponseobj = JSON.parse(cgResponse);
      if ("200" == cgresponseobj.code) {
        returnData = cgresponseobj.data;
        if (returnData.status != 0) {
          throw new Error("更新失败，查询出的采购订单为非开立态！采购订单编码为:【" + returnData.code + "】");
        } else {
          let headData = returnData;
          let bodyData = headData.purchaseOrders;
          for (var i = 0; i < bodyData.length; i++) {
            let bodydata = bodyData[i];
            bodydata.inInvoiceOrg_code = bodydata.st_purchaseorders_userDefine001;
            bodydata.inOrg_code = bodydata.st_purchaseorders_userDefine002;
            bodydata._status = "Update";
            //隐藏物料名称，SKU名称编码，提示效率
            bodydata.product_cName = null;
            bodydata.productsku_cName = null;
            bodydata.productsku_cCode = null;
          }
          let headFreeItem = headData.headFreeItem;
          if (factoryProcessValue == "新单") {
            headFreeItem.define6 = processDateValue;
          } else if (factoryProcessValue == "开单") {
            headFreeItem.define7 = processDateValue;
          } else if (factoryProcessValue == "研磨") {
            headFreeItem.define8 = processDateValue;
          } else if (factoryProcessValue == "车检") {
            headFreeItem.define9 = processDateValue;
          } else if (factoryProcessValue == "加硬") {
            headFreeItem.define10 = processDateValue;
          } else if (factoryProcessValue == "总检") {
            headFreeItem.define11 = processDateValue;
          } else if (factoryProcessValue == "待发货") {
            headFreeItem.define12 = processDateValue;
          } else {
            throw new Error("更新失败，填写的加工过程不正确！过程为:【" + factoryProcessValue + "】");
          }
          headFreeItem._status = "Update";
          headData._status = "Update"; //操作标识
          headData.bustype_code = headData.st_purchaseorder_userDefine004;
          headData.vendor_code = headData.st_purchaseorder_userDefine002;
          headData.invoiceVendor_code = headData.st_purchaseorder_userDefine003;
          headData.org_code = headData.st_purchaseorder_userDefine001;
          headData.resubmitCheckKey = replace(uuid(), "-", "");
          //删除采购部门名称，否则会提示部门不唯一
          headData.department_name = null;
          let data = {
            data: headData
          };
          var updateCgdetailurl = "https://www.example.com/" + token;
          let updateData = "";
          var updateResponse = postman("POST", updateCgdetailurl, JSON.stringify(header), JSON.stringify(data));
          var updateresponseobj = JSON.parse(updateResponse);
          if (updateresponseobj.code == 200) {
            updateData = { code: 200, message: "更新成功！" };
            return updateData;
          } else {
            throw new Error("更新失败，调用采购订单更新接口异常！错误信息:【" + updateresponseobj.message + "】");
          }
        }
      } else {
        throw new Error("更新失败，调用采购订单详情接口失败！工厂订单号为:【" + queryCode + "】,错误信息:" + cgresponseobj.message);
      }
    }
    return { request };
  }
}
exports({ entryPoint: MyAPIHandler });