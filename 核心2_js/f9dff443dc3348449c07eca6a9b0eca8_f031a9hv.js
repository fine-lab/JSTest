let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取ncc物料详情参数
    let materialNccParam = {
      day: "10"
    };
    if (param !== undefined && param.day !== undefined) {
      materialNccParam.day = param.day;
    }
    // 获取ncc物料详情
    var materialNccInfo = getMaterialInfoByNcc(materialNccParam);
    if (materialNccInfo === undefined || materialNccInfo.length < 1) {
      return {};
    }
    var accessToken;
    // 物料第几页
    var pageIndex = 1;
    // 物料列表
    var materialList = [];
    // 物料数量
    var recordCount = 0;
    while ((materialList.length < recordCount && recordCount !== 0) || pageIndex === 1) {
      let singleMaterialList = getMaterialList({
        pageIndex: pageIndex
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
    // 获取剩余库存 {"data": [{"materialCode": "1"}]}
    var queryInventoryParam = { data: [] };
    // 物料上下架状态(只记录了校验库存的物料)
    var matCode2Status = {};
    // 当前时间戳
    var nowDateTime = new Date().getTime();
    // 记录物料上下架状态
    materialList.forEach((self) => {
      matCode2Status[self.code] = {
        iUOrderStatus: self.detail.iUOrderStatus,
        iStatus: self.detail.iStatus
      };
    });
    // 物料待处理状态
    materialNccInfo.forEach((self) => {
      if (matCode2Status[self.code] === undefined) {
        return;
      }
      // 门户上下架状态
      let iUOrderStatus = matCode2Status[self.code].iUOrderStatus;
      // 商城上下架状态
      let iStatus = matCode2Status[self.code].iStatus;
      if (self.tsflag === "true") {
        if (nowDateTime > new Date(self.tstime).getTime()) {
          // 停售且停售时间小于当前时间则下架
          if (iUOrderStatus === "true") {
            let umall = {
              productCode: self.code,
              biz: "uorder"
            };
            // 商城
            unshelvesProducts.push(umall);
          }
          if (iStatus === "true") {
            let uorder = {
              productCode: self.code,
              biz: "umall"
            };
            unshelvesProducts.push(uorder);
          }
        }
      } else if (self.tcflag !== "true") {
        // 未停售&开产 ->未上架则上架
        if (iUOrderStatus === "false") {
          let umall = {
            productCode: self.code,
            biz: "uorder"
          };
          // 商城
          shelvesProducts.push(umall);
        }
        if (iStatus === "false") {
          let uorder = {
            productCode: self.code,
            biz: "umall"
          };
          shelvesProducts.push(uorder);
        }
      } else if (nowDateTime > new Date(self.tctime).getTime()) {
        // 未停售&停产->有库存则上架,无库存则下架
        queryInventoryParam.data.push({ materialCode: self.code });
      }
    });
    // 获取剩余库存 {"data": [{"materialCode": "1"}]}
    if (queryInventoryParam.data.length > 0) {
      var inventorys = extrequire("SCMSA.saleOrderSplitRule.queryInventoryApi").execute(queryInventoryParam);
      if (inventorys.code != "200") {
        throw new Error(inventorys.message);
      }
      inventorys.data.forEach((self) => {
        if (self.astinventory > 0) {
          // 上架
          if (matCode2Status[self.materialCode].iUOrderStatus === "false") {
            let umall = {
              productCode: self.materialCode,
              biz: "uorder"
            };
            // 商城
            shelvesProducts.push(umall);
          }
          if (matCode2Status[self.materialCode].iStatus === "false") {
            let uorder = {
              productCode: self.materialCode,
              biz: "umall"
            };
            shelvesProducts.push(uorder);
          }
        } else {
          // 下架
          if (matCode2Status[self.materialCode].iUOrderStatus === "true") {
            let umall = {
              productCode: self.materialCode,
              biz: "uorder"
            };
            // 商城
            unshelvesProducts.push(umall);
          }
          if (matCode2Status[self.materialCode].iStatus === "true") {
            let uorder = {
              productCode: self.materialCode,
              biz: "umall"
            };
            unshelvesProducts.push(uorder);
          }
        }
      });
    }
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
        accessToken = extrequire("SCMSA.saleOrderSplitRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function getMaterialList(params) {
      let reqParam = {
        pageIndex: params.pageIndex,
        pageSize: 500,
        simple: {
          "detail.stopstatus": false
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
    function getMaterialInfoByNcc(params) {
      let res = postman("post", "https://www.example.com/", "", JSON.stringify(params));
      try {
        // 转为JSON对象
        res = JSON.parse(res);
        // 返回信息校验
        if (res.code != "200") {
          throw new Error(res);
        }
      } catch (e) {
        throw new Error("查询NCC物料详情异常:" + res);
      }
      return res.data;
    }
    function getMaterialInfo(params) {
      let res = postman("get", "https://www.example.com/" + getAccessToken() + "&orgId=666666&id=" + params.id, "", "");
      try {
        // 转为JSON对象
        res = JSON.parse(res);
        // 返回信息校验
        if (res.code != "200") {
          throw new Error(res.message + ";商品ID[" + params.id + "]");
        }
      } catch (e) {
        throw new Error("查询物料详情异常:" + e);
      }
      return res.data;
    }
    function unshelvesProduct(params) {
      let reqParam = { data: params };
      let res = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqParam));
      // 转为JSON对象
      try {
        res = JSON.parse(res);
        // 返回信息校验
        if (res.code != "200") {
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
          throw new Error(res.message);
        }
      } catch (e) {
        throw new Error("物料档案批量上架异常:" + e);
      }
    }
  }
}
exports({ entryPoint: MyTrigger });