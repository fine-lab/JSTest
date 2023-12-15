cb.defineInner([], function () {
  var MyExternal = {
    suanliData(data, year, month) {
      if (!data || data.length <= 0) {
        return {};
      }
      let firstDate = new Date(year, month - 1, 1);
      let dataOne = [];
      let dataThree = [];
      let resultMap = new Map(); // 页签一
      let sumofmoney = 0; // 总金额
      // 获取最终父级SN编码，并回填
      debugger;
      for (let i = 0; i < data.length; i++) {
        if (!data[i].suanliType) {
          continue;
        }
        let key = data[i].suanliType + "_" + data[i].materialCode + "_" + data[i].suanliPrice + "_" + data[i].parentSN;
        let keyThree = data[i].suanliType;
        if (resultMap.has(key)) {
          let suanliCount = resultMap.get(key)["suanliCount"];
          resultMap.get(key)["suanliCount"] = suanliCount + 1;
        } else {
          data[i]["suanliCount"] = 1;
          resultMap.set(key, data[i]);
        }
        // 页签三，大于等于所选月份的资产
      }
      resultMap.forEach((value, key) => {
        if (!value.suanliPrice || value.suanliPrice == "") {
          value.suanliPrice = 0;
        }
        value.suanliSum = value.suanliPrice * value.suanliCount;
        sumofmoney += value.suanliSum;
        dataOne.push(value);
      });
      return { dataOne: dataOne, dataThree: {}, sumMoney: sumofmoney };
    }
  };
  return MyExternal;
});