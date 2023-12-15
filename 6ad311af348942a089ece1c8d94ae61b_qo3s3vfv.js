// 获取系统变量和预置变量
const { reaction, observable } = mobx;
const { countFormula } = await loadYNF("ynf-fw-formula-api");
// 设置子表的行号
let tableStoreRowIndex = 0;
// 设置孙表的行号
let subTableStoreRowIndex = 0;
// 防抖函数
let debounceIdList = {};
const debounce = (fn, funcId, delay) => {
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceIdList[funcId]);
    debounceIdList[funcId] = setTimeout(function () {
      delete debounceIdList[funcId];
      fn.apply(context, args);
    }, delay);
  };
};
// 获取页面所有数据
// 合并特征字段
const getFeatureObj = (parentObj = {}, currStoreField, currKey, storeFieldArr = []) => {
  // 获取当前
  if (storeFieldArr.length - 1 === currKey) {
    parentObj[currStoreField] = "";
  } else {
    parentObj[currStoreField] = getFeatureObj(parentObj[currStoreField], storeFieldArr[currKey + 1], currKey + 1, storeFieldArr) || {};
  }
  return parentObj;
};
// 通过listReaction获取所有的数据
const getAllDataByListReaction = ({ listReactionList, storeControlType, storeField, rowStore, storeForm, dataSource }) => {
  let allData = [];
  if (storeControlType === "TableStore") {
    // 子表逻辑
    // 子表行数据
    let rowData = rowStore?.getValue() || {};
    const storeFieldArr = storeField?.split(".") || [];
    // 判断是不是特征组
    if (storeFieldArr.length >= 2) {
      rowData = getFeatureObj(rowData, storeFieldArr[0], 0, storeFieldArr);
    } else {
      rowData[storeField] = "";
    }
    allData = [rowData];
  } else if (storeControlType === "TableFormStore") {
    // 移动端子表新增页逻辑
    // 获取当发子表的formStore数据
    let tableRowData = rootStore[storeForm]?.getValue() || {};
    if (storeFieldArr.length >= 2) {
      tableRowData = getFeatureObj(tableRowData, storeFieldArr[0], 0, storeFieldArr);
    } else {
      tableRowData[storeField] = "";
    }
    allData = [tableRowData];
  }
  return allData;
};
// 通过cardStoreAlias获取所有的数据
const getAllDataByCardStore = ({ cardStoreAlias, storeControlType, storeField, rowStore, storeForm, dataSource }) => {
  // 获取当前cardStore的数据
  let allData = rootStore?.[cardStoreAlias]?.getValue({ dirtyCheck: false }) || {};
  const storeFieldArr = storeField?.split(".") || [];
  // 每种数据类型的处理方式是不一样的
  if (storeControlType === "FormStore" || storeControlType === "unSetStoreAlias") {
    // 主表逻辑
    // 判断是不是特征组
    if (storeFieldArr.length >= 2) {
      allData = getFeatureObj(allData, storeFieldArr[0], 0, storeFieldArr);
    } else {
      allData[storeField] = "";
    }
  } else if (storeControlType === "TableStore") {
    // 子表逻辑
    // 子表行数据
    let rowData = rowStore?.getValue() || {};
    // 判断是不是特征组
    if (storeFieldArr.length >= 2) {
      rowData = getFeatureObj(rowData, storeFieldArr[0], 0, storeFieldArr);
    } else {
      rowData[storeField] = "";
    }
  } else if (storeControlType === "TableFormStore") {
    // 移动端子表新增页逻辑
    // 获取当发子表的formStore数据
    let tableRowData = rootStore[storeForm]?.getValue() || {};
    // 判断是不是特征组
    if (storeFieldArr.length >= 2) {
      tableRowData = getFeatureObj(tableRowData, storeFieldArr[0], 0, storeFieldArr);
    } else {
      tableRowData[storeField] = "";
    }
    // 直接覆盖子表数据源的数据
    allData[dataSource] = [tableRowData];
  }
  // 返回所有的的数据
  return allData;
};
// 判断是否要创建就执行
const isFireImmediately = () => {
  if (rootStore.pageStore) {
    if (rootStore.pageStore.status === "browse") {
      return true;
    }
  } else if (rootStore.cardStore) {
    if (rootStore.cardStore.uiState === "browse") {
      return false;
    }
  } else {
    if (rootStore.tableStore.uiState === "browse") {
      return false;
    }
  }
  return true;
};
const getTimeStamp = (value, type) => {
  let result = "";
  if (type === "time") {
    value = value?.split(":");
    value.map((item, index) => {
      if (index === 0) {
        result = Number(item) * 3600;
      } else if (index === 1) {
        result = Number(result) + Number(item) * 60;
      } else if (index === 2) {
        result = Number(result) + Number(item);
      }
    });
  } else {
    result = new Date(value).getTime();
  }
  // 将数字转成字符串
  return result + "";
};
const revisedData = (value) => {
  let result = value;
  // 判断值是否为null,undefined,空字符串
  if (typeof value === undefined || value === "" || value === null) {
    return "";
  }
  // 判断是否为数字或者布尔
  if (typeof value === "boolean" || typeof value === "number") {
    return JSON.stringify(value);
  }
  try {
    result = JSON.parse(result);
    // 判断undefined,null,number,boolean
    if (result === undefined || result === null || typeof result === "boolean" || typeof result === "number") {
      return value;
    } else {
      return result;
    }
  } catch (err) {
    return value;
  }
};
const baseCompare = (leftValue = "", operational, rightValue = "") => {
  let flag = true;
  // 进到基本数据类型比较的一定是字符型，在这个之前已经对特殊类型数据进行处理了
  if (typeof leftValue !== "string" || typeof rightValue !== "string") {
    return false;
  }
  switch (operational) {
    // 等于
    case "eq":
      flag = leftValue == rightValue;
      break;
    // 不等于
    case "neq":
      flag = leftValue != rightValue;
      break;
    // 大于
    case "gt":
      flag = Number(leftValue) > Number(rightValue);
      break;
    // 小于
    case "lt":
      flag = Number(leftValue) > Number(rightValue);
      break;
    // 小于等于
    case "elt":
      flag = Number(leftValue) > Number(rightValue);
      break;
    // 大于等于
    case "egt":
      flag = Number(leftValue) > Number(rightValue);
      break;
    // 不为空
    case "is_not_null":
      flag = leftValue.length != 0;
      break;
    // 为空
    case "is_null":
      flag = leftValue.length == 0;
      break;
    // 开始以
    case "leftlike":
      flag = leftValue.startsWith(rightValue);
      break;
    // 结束以
    case "rightlike":
      flag = leftValue.endsWith(rightValue);
      break;
    // 包含
    case "like":
      flag = leftValue.includes(rightValue);
      break;
    default:
      flag = false;
      break;
  }
  // 防止出现NaN
  return !!flag;
};
const arrCompare = (arr1 = [], arr2 = [], operational) => {
  let flag = true;
  switch (operational) {
    // 等于
    case "eq":
      if (arr1.length !== arr2.length) {
        return false;
      }
      const sortedArr1 = arr1.slice().sort();
      const sortedArr2 = arr2.slice().sort();
      flag = sortedArr2.every((item, index) => JSON.stringify(item) === JSON.stringify(sortedArr1[index]));
      break;
    // 不等于
    case "neq":
      if (arr1.length !== arr2.length) {
        return true;
      }
      const sortedArr3 = arr1.slice().sort();
      const sortedArr4 = arr2.slice().sort();
      flag = !sortedArr4.every((item, index) => JSON.stringify(item) === JSON.stringify(sortedArr3[index]));
      break;
    // 在列表中
    case "in":
      flag = arr1.every((item) => arr2.includes(item));
      break;
    // 不在列表中
    case "nin":
      flag = !arr1.every((item) => arr2.includes(item));
      break;
  }
  return flag;
};
// 表达式解析
const expressionParsing = (data) => {
  // 定义返回值
  let result = true;
  // 获取初始化数据
  const { leftValue, rightValue, operational, extLeftValue = {}, extRightValue = {} } = data;
  // 获取左值数据类型
  const leftValueBizType = extLeftValue.bizType || "text";
  // 获取右值数据类型
  const rightValueBizType = extRightValue.bizType || "bizType";
  let realLeftValue = revisedData(leftValue);
  let realRightValue = revisedData(rightValue);
  switch (leftValueBizType) {
    case "date":
    case "dateTime":
      // 非空
      if (operational === "is_not_null") {
        result = realLeftValue.length !== 0;
        break;
      }
      // 为空
      if (operational === "is_null") {
        result = realLeftValue.length === 0;
        break;
      }
      if (rightValueBizType === "dateTime" || rightValueBizType === "date") {
        realLeftValue = getTimeStamp(realLeftValue);
        realRightValue = getTimeStamp(realRightValue);
        if (operational === "between") {
          const endTime = getTimeStamp(extRightValue.endTime);
          result = realRightValue <= realLeftValue && realLeftValue <= endTime;
          break;
        }
        result = baseCompare(realLeftValue, operational, realRightValue);
        break;
      }
      result = baseCompare(realLeftValue, operational, realRightValue);
      break;
    case "time":
      // 非空
      if (operational === "is_not_null") {
        result = realLeftValue.length !== 0;
        break;
      }
      // 为空
      if (operational === "is_null") {
        result = realLeftValue.length === 0;
        break;
      }
      // 右值为time时
      if (rightValueBizType === "time") {
        realLeftValue = getTimeStamp(realLeftValue, "time");
        realRightValue = getTimeStamp(realRightValue, "time");
        if (operational === "between") {
          const endTime = getTimeStamp(extRightValue.endTime, "time");
          result = realRightValue <= realLeftValue && realLeftValue <= endTime;
          break;
        }
        result = baseCompare(realLeftValue, operational, realRightValue);
        break;
      }
      result = baseCompare(realLeftValue, operational, realRightValue);
      break;
    // 单选参照:为空，不为空，相等，不相等
    case "quote":
      // 非空
      if (operational === "is_not_null") {
        result = realLeftValue.length !== 0;
        break;
      }
      // 为空
      if (operational === "is_null") {
        result = realLeftValue.length === 0;
        break;
      }
      // 右值为多选参照，需要处理
      if (rightValueBizType === "quoteList") {
        result = baseCompare(realLeftValue, operational, realRightValue);
        break;
      }
      // 右值为单选参照或默认右值框，以及其他数值类型
      result = baseCompare(realLeftValue, operational, realRightValue);
      break;
    // 证件号:为空，非空，等于，全等，开始以，结束以，包含
    case "credentialNo":
      // 左值进行处理
      realLeftValue = realLeftValue || { idType: "", identity: "" };
      // 需要先转化成字符串,否则trim报错
      realLeftValue.identity = revisedData(realLeftValue.identity);
      // 非空
      if (operational === "is_not_null") {
        result = realLeftValue.identity.length !== 0;
        break;
      }
      // 为空
      if (operational === "is_null") {
        result = realLeftValue.identity.length === 0;
        break;
      }
      // 右值为证件号
      if (rightValueBizType === "credentialNo") {
        if (realLeftValue.idType == realRightValue.idType) {
          result = baseCompare(realLeftValue.identity, operational, realRightValue.identity);
          break;
        } else {
          result = false;
          break;
        }
      }
      // 右值只是普通文本框
      result = baseCompare(realLeftValue.identity, operational, realRightValue);
      break;
    // 枚举类型
    case "singleOption":
    case "multipleOption":
      // 不为空
      if (operational === "is_not_null") {
        result = realLeftValue.length !== 0;
      }
      // 为空
      if (operational === "is_null") {
        result = realLeftValue.length === 0;
      }
      // 右值为单选枚举和多选枚举
      if (rightValueBizType === "singleOption" || rightValueBizType === "multipleOption") {
        // 左值变成数组
        realLeftValue = Array.isArray(realLeftValue) ? realLeftValue : realLeftValue?.split(",");
        // 右值变成数组
        realRightValue = Array.isArray(realRightValue) ? realRightValue : realRightValue.split(",");
        // 判断相等，不相等，在列表中，不在列表中
        result = arrCompare(realLeftValue, realRightValue, operational);
        break;
      }
      result = baseCompare(realLeftValue, operational, realRightValue);
      break;
    // 走默认说明左值只是普通文本,不是对象等类
    default:
      // 右值为证件类型
      if (rightValueBizType === "credentialNo") {
        result = baseCompare(realLeftValue, operational, realRightValue.identity);
        break;
      }
      result = baseCompare(realLeftValue, operational, realRightValue);
      break;
  }
  return result;
};
// 计算属性代码监听开始
// 扩展新的store
const computedAttrStore = {
  // 扩展get 方法
  formulacustomSetValueInputNumber2lc() {}
};
// 方法改成计算方法
const computedAttr = {
  formulacustomSetValueInputNumber2lc: observable
};
// 设置监听
makeObservable(computedAttrStore, computedAttr);
// 自己挂载到rootStore上
rootStore.computedAttrStore = computedAttrStore;
rootStore.eventBus.on(rootStore, "load", function () {
  rootStore.reactions.computedAttr = {
    formula_customSetValue_formStore_InputNumber2lc: reaction(
      () => [],
      async ([]) => {
        debounce(
          async () => {
            const allData = getAllDataByCardStore({
              cardStoreAlias: "cardStore",
              storeControlType: "FormStore",
              storeField: "InputNumber2l",
              storeForm: "",
              dataSource: "mainEntity"
            });
            const formulaResult = await countFormula(
              {
                hasFormula: "true",
                formula: 'getValue("yonbip-ec-iform.qo3s3vfv_xtbdywdxtest.xtbdywdxtest","wb_1699497619907906","wb_1699495922063551","Input20rg")',
                formulaFuns: "getValue",
                formulaTriggers: ""
              },
              {
                mainDataSourceAlias: "mainEntity",
                field: "InputNumber2l",
                billnum: "adasd",
                domainKey: "yourKeyHere",
                allData: allData || {}
              }
            );
            //对公式结果进行处理
            const resultData = formulaResult.resultData;
            rootStore.formStore.setValue("InputNumber2l", resultData);
          },
          "formula_customSetValue_formStore_InputNumber2lc" + "_" + tableStoreRowIndex + "_" + subTableStoreRowIndex,
          300
        )();
      },
      {
        // 是否立即执行
        fireImmediately: isFireImmediately(),
        // 判断是否要执行副函数
        equals: function (prev = [], next = []) {
          // 判断是否要执行副函数
          let flag = false;
          if (prev.length > 0) {
            // 如果一模一样则不执行副函数
            flag = JSON.stringify(prev) === JSON.stringify(next);
          }
          if (rootStore.pageStore) {
            if (rootStore.pageStore.status === "browse") {
              return true;
            }
          } else if (rootStore.cardStore) {
            if (rootStore.cardStore.uiState === "browse") {
              return true;
            }
          } else {
            if (rootStore.tableStore.uiState === "browse") {
              return true;
            }
          }
          return flag;
        }
      }
    )
  };
});
// 计算属性代码监听结束