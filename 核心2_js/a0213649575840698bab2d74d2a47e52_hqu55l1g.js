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
          options: { domainKey: process.env.__DOMAINKEY__ }
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
      options: { async: false, domainKey: process.env.__DOMAINKEY__ }
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
      options: { async: false, domainKey: process.env.__DOMAINKEY__ }
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