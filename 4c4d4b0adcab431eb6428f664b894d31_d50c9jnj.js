let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.param;
    let reNos = "(";
    if (data.length == 0) {
      return { data: "无需更新" };
    }
    data.map((item, i) => {
      if (item.rec_no == null) {
        throw new Error("到货单号不能为空");
      } else {
        reNos += "'" + item.rec_no + "',";
      }
      if (item.log_no == null) {
        throw new Error("到货单号" + item.rec_no + "的物流单号不能为空");
      }
      if (item.locateInfoList == null) {
        throw new Error("到货单号" + item.rec_no + "的地图信息不能为空");
      }
      let children = item.locateInfoList;
      children.map((item2, j) => {
        if (item2.locate == null) {
          throw new Error("到货单号" + item.rec_no + "的地图描点信息不能为空");
        }
        if (item2.update_time == null) {
          throw new Error("到货单号" + item.rec_no + "的更新时间不能为空");
        }
      });
    });
    if (reNos.length < 3) {
      return { data: "无需更新" };
    }
    reNos = reNos.substr(0, reNos.length - 1) + ")";
    //查询
    var sql = "select (select * from locateInfoList) locateInfoList ,rec_no,id,log_no from AT1707A99A16B00005.AT1707A99A16B00005.wlztxx  where rec_no in " + reNos;
    var updateArray = ObjectStore.queryByYonQL(sql);
    //区分新增和更新的信息
    let addArray = [];
    if (updateArray.length <= 0) {
      addArray = data;
    } else {
      data.forEach((item, i) => {
        let isAdd = true;
        updateArray.forEach((obj, j) => {
          if (item.rec_no == obj.rec_no) {
            isAdd = false;
          }
        });
        if (isAdd == true) {
          let children = obj.locateInfoList;
          children.forEach((child, k) => {
            child._status = "Insert";
          });
          addArray.push(item);
        }
      });
    }
    if (updateArray.length > 0) {
      updateArray.map((item, i) => {
        data.forEach((obj, j) => {
          if (item.rec_no == obj.rec_no) {
            item.log_no = obj.log_no;
            let children = obj.locateInfoList;
            let bdChildren = item.locateInfoList;
            bdChildren.forEach((child, k) => {
              child._status = "Update";
            });
            children.forEach((child, k) => {
              child._status = "Insert";
              item.locateInfoList.push(child);
            });
          }
        });
      });
      //更新
      var res = ObjectStore.updateBatch("AT1707A99A16B00005.AT1707A99A16B00005.wlztxx", updateArray, "yba8d3690f");
    } else {
      //新增
      var res = ObjectStore.insertBatch("AT1707A99A16B00005.AT1707A99A16B00005.wlztxx", addArray, "yba8d3690f");
    }
    return { data: "更新完成" };
  }
}
exports({ entryPoint: MyAPIHandler });