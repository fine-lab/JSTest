let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: "200",
      msg: "",
      dataInfo: ""
    };
    try {
      let { barCode, productName, manufatureCode, size, color, accessories, qty, remarks, dateTime } = request; //barCode物料条码
      let sql = "select id,b.barCode barCode from pc.product.Product inner join pc.product.ProductDetail b on b.productId=id where b.barCode='" + barCode + "'";
      var productdata = ObjectStore.queryByYonQL(sql, "productcenter");
      if (productdata.length == 0) {
        throw new Error("物料编码[" + barCode + "]未找到");
      }
      let productId = productdata[0].id;
      let data = this.getFirstDate(dateTime); //日期
      sql = "select id from AT15DCCE0808080001.AT15DCCE0808080001.inventorydate where date='" + data + "'";
      let inventorymain = ObjectStore.queryByYonQL(sql, "developplatform");
      sql =
        "select b.id id,b.product productId from AT15DCCE0808080001.AT15DCCE0808080001.inventorydate inner join  AT15DCCE0808080001.AT15DCCE0808080001.inventoryinfo b on id=b.inventorydate_id where date='" +
        data +
        "' and b.product=" +
        productId;
      var inventoryInfo = ObjectStore.queryByYonQL(sql, "developplatform");
      let object = {
        inventoryinfoList: [
          {
            productName,
            manufatureCode,
            size,
            color,
            accessories,
            qty,
            remarks,
            updateTime: this.formatDateTimeStr(1)
          }
        ]
      };
      var res;
      if (inventorymain.length > 0) {
        object.id = inventorymain[0].id;
        if (inventoryInfo.length > 0) {
          object.inventoryinfoList[0].id = inventoryInfo[0].id;
          object.inventoryinfoList[0]._status = "Update";
        } else {
          object.inventoryinfoList[0].product = productId;
          object.inventoryinfoList[0]._status = "Insert";
        }
        res = ObjectStore.updateById("AT15DCCE0808080001.AT15DCCE0808080001.inventorydate", object, "ybd3fce1ccList");
      } else {
        object.date = data;
        object.inventoryinfoList[0].product = productId;
        res = ObjectStore.insert("AT15DCCE0808080001.AT15DCCE0808080001.inventorydate", object, "ybd3fce1ccList");
      }
      rsp.dataInfo = res;
    } catch (ex) {
      rsp.code = 500;
      rsp.msg = ex.message;
    }
    return rsp;
  }
  getFirstDate(date) {
    var datatime = new Date(date);
    var y = datatime.getFullYear();
    var m = datatime.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    return y + "-" + m + "-" + "01";
  }
  // 获取时间
  formatDateTimeStr(type = 1) {
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var dateObject = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var y = dateObject.getFullYear();
    var m = dateObject.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = dateObject.getDate();
    d = d < 10 ? "0" + d : d;
    var h = dateObject.getHours();
    h = h < 10 ? "0" + h : h;
    var minute = dateObject.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    var second = dateObject.getSeconds();
    second = second < 10 ? "0" + second : second;
    if (type === 1) {
      // 返回年月日
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    } else if (type === 2) {
      // 返回年月日 时分秒
      return h + "" + minute + "" + second;
    }
  }
}
exports({ entryPoint: MyAPIHandler });