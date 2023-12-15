// 根据商品ID 获取商品数据
function getUPCGoodsColumns(id, args = {}, crossNames, url) {
  if (!id) return { code: 500, message: "id 不能为空" };
  if (!cb.cache.get("upcgoodsinfo")) {
    cb.cache.set("upcgoodsinfo", {});
  }
  if (cb.utils.isArray(id)) {
    // 如果传过来的是数组
    return getUpc(id, args, crossNames);
  }
  if (Object.prototype.toString.call(id) === "[object Object]") {
    let { ids, async, callback, args, crossNames } = id;
    if (async === false) {
      // 同步代码
      // 如果有回调 回调回去 没有返回 正常 物料信息
      return callback ? callback(null, getUpc(ids, args, crossNames)) : getUpc(ids, args, crossNames);
    } else {
      let results = {}; // 返回商品合集
      let restId = []; // 没有缓存的id集合
      ids.map((v) => {
        if (cb.cache.get("upcgoodsinfo")[v]) {
          results[v] = cb.cache.get("upcgoodsinfo")[v];
        } else {
          restId.push(v);
        }
      });
      let params = {
        products: restId
      };
      let Proxy = cb.rest.DynamicProxy.create({
        getColumns: {
          url: "/api/product/getSpecSets",
          method: "POST",
          options: { domainKey: "yourKeyHere" }
        }
      });
      Proxy.getColumns(params, function (err, result) {
        // 处理数据
        if (result && cb.utils.isArray(result)) {
          result.map((product, index) => {
            results[restId[index]] = makeSpec(product, restId[index], args, crossNames);
          });
        }
        callback(err, results);
      });
    }
  }
  // 单独的ID
  if (cb.cache.get("upcgoodsinfo") && cb.cache.get("upcgoodsinfo")[id]) return cb.cache.get("upcgoodsinfo")[id];
  let Proxy = cb.rest.DynamicProxy.create({
    getColumns: {
      url: "/api/product/getSpecSet",
      method: "GET",
      options: { async: false, domainKey: "yourKeyHere" }
    }
  });
  let params = {
    productId: id
  };
  let data = Proxy.getColumns(params);
  return makeSpec(data?.result, id, args.config, crossNames);
}
// 同步请求数据
function getUpc(id, args, crossNames) {
  let results = {}; // 返回商品合集
  let restId = []; // 没有缓存的id集合
  id.map((v) => {
    if (cb.cache.get("upcgoodsinfo")[v]) {
      results[v] = cb.cache.get("upcgoodsinfo")[v];
    } else {
      restId.push(v);
    }
  });
  let params = {
    products: restId
  };
  let Proxy = cb.rest.DynamicProxy.create({
    getColumns: {
      url: "/api/product/getSpecSets",
      method: "POST",
      options: { async: false, domainKey: "yourKeyHere" }
    }
  });
  let data = Proxy.getColumns(params);
  if (data?.result && cb.utils.isArray(data.result)) {
    data.result.map((product, index) => {
      results[restId[index]] = makeSpec(product, restId[index], args, crossNames);
    });
  }
  return results;
}
// 组装数据
function makeSpec(product, productId, config = {}, crossNames) {
  let _obj = {};
  let SpecSumsObj = {};
  if (!product || !product.productTemplate || !cb.utils.isArray(product.productTemplate.SpecSums) || product.productTemplate.SpecSums.length < 2) {
    _obj = {
      SpecSumsObj,
      data: product
    };
    cb.cache.get("upcgoodsinfo")[productId] = _obj;
    return _obj;
  }
  let SpecSums = product.productTemplate.SpecSums;
  let _rowItemData = SpecSums.filter((v) => !v.twoDimensionalInput); // 模板 行
  let rowItemData = _rowItemData.map((v) => v.specification_defineId);
  let _colItemData = SpecSums.filter((v) => v.twoDimensionalInput); // 模板 列名
  if (!_colItemData.length) {
    _obj = {
      SpecSumsObj: {
        rowItemData: {
          fieldNames: rowItemData,
          fieldValues: [],
          fieldHide: []
        },
        colItemData: config.colItemData
      },
      data: product
    };
    cb.cache.get("upcgoodsinfo")[productId] = _obj;
    return _obj;
  }
  let colItemData = _colItemData.map((v) => v.specification_defineId); // 列名
  let colFieldValues = _colItemData[0].specitem.split("; ").map((v) => [v]);
  SpecSumsObj = {
    rowItemData: {
      fieldNames: rowItemData,
      fieldValues: [],
      fieldHide: []
    },
    colItemData: {
      fieldNames: colItemData,
      fieldValues: colFieldValues,
      fieldMultiCol: colItemData
    },
    crossItemData: {
      fieldNames: crossNames
    }
  };
  _obj = {
    SpecSumsObj,
    data: product
  };
  cb.cache.get("upcgoodsinfo")[productId] = _obj;
  return _obj;
}
let getUPCTemplateInfo = (id, url, cache) => {
  if (!cb.cache.get("upctemplateinfo") && cache) {
    cb.cache.set("upctemplateinfo", {});
  }
  if (cb.cache.get("upctemplateinfo") && cb.cache.get("upctemplateinfo")[id] && cache) return cb.cache.get("upctemplateinfo")[id];
  url = url ? url + "/" + id : "youridHere" + id;
  let Proxy = cb.rest.DynamicProxy.create({
    getColumns: { url: url, method: "GET", options: { async: false, domainKey: "yourKeyHere" } }
  });
  let params = { billnum: "pc_producttpl", id: id };
  let data = Proxy.getColumns(params);
  console.log(data.result);
  if (cache) cb.cache.get("upctemplateinfo")[id] = { ...data.result };
  return { ...data.result };
};
function saveSpeproitem(template, id, name, url) {
  if (!template) {
    return { code: 500, message: "template 不能为空" };
  }
  if (!id) {
    return { code: 500, message: "id 不能为空" };
  }
  if (!name) {
    return { code: 500, message: "name 不能为空" };
  }
  url = url ? url + "/uniform/api/upc/save" : "/api/upc/save";
  cb.utils.loadingControl.start();
  let Proxy = cb.rest.DynamicProxy.create({
    getSpeproitem: { url: url, method: "POST", options: { async: false, domainKey: "yourKeyHere" } }
  });
  let params = {
    billnum: "pc_speproitem",
    data: {
      template: template,
      id: id,
      userdefinespecs: [
        {
          hasDefaultInit: true,
          name: name,
          _status: "Insert"
        }
      ],
      _status: "Update"
    }
  };
  let data = Proxy.getSpeproitem(params);
  cb.utils.loadingControl.end();
  if (data.err) {
    cb.utils.alert(data.err, "error");
    return;
  }
  return data;
}
cb.define("productcenter.external", ["common/support/index.jsx"], function (common) {
  var detailsModel = viewModel.getGridModel("salesAdvanceOrder_bList");
  detailsModel.on("afterCellValueChange", function (data) {
    if (data && data.cellName) {
      if (data.cellName.indexOf("free") != -1) {
        freeChangeControl(detailsModel, data); //规格值改变后control
      }
    }
  });
  var freeChangeControl = function (detailsModel, data) {
    let specitemValue;
    if (data.value.name == undefined) {
      specitemValue = data.value ? data.value : null;
    } else {
      specitemValue = data.value ? data.value.name : null;
    }
    if (specitemValue && JSON.stringify(specitemValue) != "{}") {
      let cellName = data.cellName;
      //获取物料id
      let currentRow = detailsModel.getRow(data.rowIndex);
      let product = currentRow.agentProductCode;
      let specitem;
      let template;
      let specification;
      let pecBusinessDynamic;
      if (!cb.utils.isEmpty(product)) {
        let productValue = getUPCGoodsColumns(product, { config: {} });
        let productData = productValue.data;
        if (productData) {
          let productSpecSums = productData.productTemplate ? productData.productTemplate.SpecSums : null;
          if (productSpecSums != null) {
            let templateObject = getUPCTemplateInfo(productData.productTemplate.id);
            productSpecSums = templateObject.SpecSums;
            for (let i = 0; i < productSpecSums.length; i++) {
              let free = productSpecSums[i].specification_defineId;
              if (free == cellName) {
                specitem = productSpecSums[i].specitem;
                template = productSpecSums[i].template;
                specification = productSpecSums[i].specification;
                pecBusinessDynamic = productSpecSums[i] ? productSpecSums[i].specBusinessDynamic : null;
              }
            }
          }
        }
      }
      if (specitem) {
        var str = specitem.split("; ");
        if (str) {
          if (str.indexOf(specitemValue) == -1) {
            if (pecBusinessDynamic != null) {
              if (pecBusinessDynamic == true) {
                let returnPromise = new cb.promise();
                //提示用户是否录入规格值
                let msg = "规格值在模板中不存在，是否继续。";
                cb.utils.confirm(
                  msg,
                  function () {
                    let insertResult = saveSpeproitem(template, specification, specitemValue, null);
                    if (insertResult.result.sucessCount == 0) {
                      cb.utils.alert("操作失败！");
                    } else {
                      cb.utils.alert("操作成功！");
                    }
                    returnPromise.resolve();
                  },
                  function () {
                    detailsModel.getEditRowModel().get(data.cellName).setValue(null);
                    detailsModel.setCellValue(data.rowIndex, data.cellName, null);
                    returnPromise.reject();
                  }
                );
                return returnPromise;
              } else {
                detailsModel.getEditRowModel().get(data.cellName).setValue(null);
                detailsModel.setCellValue(data.rowIndex, data.cellName, null);
                cb.utils.alert("规格值在模板中不存在，请重新录入！");
                return false;
              }
            }
          } else {
            return true;
          }
        }
      }
    }
  };
});