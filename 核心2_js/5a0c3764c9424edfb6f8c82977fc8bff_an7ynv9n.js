let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 操作几天前的物料
    let day = 5;
    if (param !== undefined && param.day !== undefined) {
      day = param.day;
    }
    // 当前时间戳 new Date()少28800000
    var nowDate = new Date(new Date().getTime() + 28800000);
    var nowDateTime = nowDate.getTime();
    nowDate = nowDate.setDate(nowDate.getDate() - day);
    var pubts = timestampToTime(nowDate);
    var accessToken;
    // 物料第几页
    var pageIndex = 1;
    // 物料列表
    var materialList = [];
    // 物料数量
    var recordCount = 0;
    while ((materialList.length < recordCount && recordCount !== 0) || pageIndex === 1) {
      let singleMaterialList = getMaterialList({
        pageIndex: pageIndex,
        pubts: pubts
      });
      materialList = materialList.concat(singleMaterialList);
      pageIndex++;
    }
    if (materialList.length === 0) {
      return;
    }
    // 待上架商品
    var shelvesProducts = [];
    // 待下架商品
    var unshelvesProducts = [];
    // 指定组织
    var defOrgIds = [undefined, "2590351100121345"];
    materialList.forEach((self) => {
      if (self.freeDefine == undefined) {
        return;
      }
      // 自动上下架操作（上架/下架）
      let define16 = self.freeDefine.define16;
      // 自动上下架时间（2023-02-28 15:52:49）
      let define17 = self.freeDefine.define17;
      if (define16 == undefined || define17 == undefined || nowDateTime < new Date(define17).getTime()) {
        return;
      }
      // 门户上下架状态
      let iUOrderStatus = self.detail.iUOrderStatus + "";
      // 商城上下架状态
      let iStatus = self.detail.iStatus + "";
      if (define16 == "下架") {
        if (iUOrderStatus === "true") {
          defOrgIds.forEach((defOrgId) => {
            let umall = {
              productCode: self.code,
              biz: "uorder",
              orgId: defOrgId
            };
            // 商城
            unshelvesProducts.push(umall);
          });
        }
        if (iStatus === "true") {
          defOrgIds.forEach((defOrgId) => {
            let uorder = {
              productCode: self.code,
              biz: "umall",
              orgId: defOrgId
            };
            unshelvesProducts.push(uorder);
          });
        }
      } else if (define16 == "上架") {
        if (iUOrderStatus === "false") {
          defOrgIds.forEach((defOrgId) => {
            let umall = {
              productCode: self.code,
              biz: "uorder",
              orgId: defOrgId
            };
            // 商城
            shelvesProducts.push(umall);
          });
        }
        if (iStatus === "false") {
          defOrgIds.forEach((defOrgId) => {
            let uorder = {
              productCode: self.code,
              biz: "umall",
              orgId: defOrgId
            };
            shelvesProducts.push(uorder);
          });
        }
      }
    });
    // 批量上架
    if (shelvesProducts.length > 0) {
      shelvesProduct(shelvesProducts);
    }
    // 批量下架
    if (unshelvesProducts.length > 0) {
      unshelvesProduct(unshelvesProducts);
    }
    // 响应
    return {};
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function getMaterialList(params) {
      let reqParam = {
        pageIndex: params.pageIndex,
        pageSize: 500,
        simple: {
          "detail.stopstatus": false,
          pubts: params.pubts
        }
      };
      let res = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqParam));
      // 转为JSON对象
      try {
        res = JSON.parse(res);
        // 返回信息校验
        if (res.code != "200") {
          throw new Error(res.message);
        }
      } catch (e) {
        throw new Error("查询物料列表异常:" + e);
      }
      recordCount = res.data.recordCount;
      return res.data.recordList;
    }
    function unshelvesProduct(params) {
      let reqParam = { data: params };
      let res = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqParam));
      // 转为JSON对象
      try {
        res = JSON.parse(res);
        // 返回信息校验
        if (res.code != "200") {
          if (includes(res.message + "", "该物料未分配给该组织")) {
            return;
          }
          throw new Error(res.message);
        }
      } catch (e) {
        throw new Error("物料档案批量下架异常:" + e);
      }
    }
    function shelvesProduct(params) {
      let reqParam = { data: params };
      let res = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqParam));
      // 转为JSON对象
      try {
        res = JSON.parse(res);
        // 返回信息校验
        if (res.code != "200") {
          if (includes(res.message + "", "该物料未分配给该组织")) {
            return;
          }
          throw new Error(res.message);
        }
      } catch (e) {
        throw new Error("物料档案批量上架异常:" + e);
      }
    }
    function timestampToTime(timestamp) {
      var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
      var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":";
      var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    }
  }
}
exports({ entryPoint: MyTrigger });