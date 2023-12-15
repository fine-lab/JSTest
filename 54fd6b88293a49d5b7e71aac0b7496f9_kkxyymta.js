let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询变更内容
    let change_id = param.data[0].id;
    var chk_change_object = {
      id: change_id,
      compositions: [
        {
          name: "SY01_customer_license_change",
          compositions: []
        }
      ]
    };
    //实体查询
    var change_res = ObjectStore.selectById("ISY_2.ISY_2.SY01_customer_license_change", chk_change_object);
    //原证照主表id
    let license_id = change_res.apply_license;
    //变更明细
    var change_detail = ObjectStore.queryByYonQL("select * from ISY_2.ISY_2.SY01_customer_license_change_d where dr=0 and SY01_customer_license_change_id='" + change_id + "'", "sy01");
    if (change_detail.length == 0) {
      throw new Error("变更单至少包含一条明细");
    }
    for (let j = 0; j < change_detail.length; j++) {
      change_detail[j].has_flag = false;
      for (let k = j + 1; k < change_detail.length; k++) {
        if (change_detail[j].license_type == change_detail[k].license_type && change_detail[j].license_code == change_detail[k].license_code) {
          throw new Error("出现重复的证照。相同证照类型下证照编号不能相同");
        }
      }
    }
    //原证明细
    var license_de = ObjectStore.queryByYonQL("select * from ISY_2.ISY_2.SY01_customer_license_detail where dr=0 and license_file_id='" + license_id + "'", "sy01");
    //比对明细变更
    //更新
    var updatedetal = [];
    var deletetal = [];
    var addtal = [];
    for (let i = 0; i < license_de.length; i++) {
      let del_flag = true;
      for (let j = 0; j < change_detail.length; j++) {
        if (license_de[i].license_type == change_detail[j].license_type && license_de[i].license_code == change_detail[j].license_code) {
          del_flag = false;
          change_detail[j].has_flag = true;
          let yuan_validity_date = "";
          if (license_de[i].validity_end_date != change_detail[j].validity_end_date) {
            yuan_validity_date = license_de[i].validity_end_date;
          }
          updatedetal.push({
            id: license_de[i].id,
            validity_start_date: change_detail[j].validity_start_date,
            validity_end_date: change_detail[j].validity_end_date,
            yuan_validity_end: yuan_validity_date,
            remark: change_detail[j].remark
          });
          break;
        }
      }
      if (del_flag) {
        deletetal.push({
          id: license_de[i].id
        });
      }
    }
    for (let j = 0; j < change_detail.length; j++) {
      if (change_detail[j].has_flag == false) {
        addtal.push({
          license_type: change_detail[j].license_type,
          validity_start_date: change_detail[j].validity_start_date,
          remark: change_detail[j].remark,
          validity_end_date: change_detail[j].validity_end_date,
          license_code: change_detail[j].license_code,
          SY01_customer_license_file_id: license_id
        });
      }
    }
    let upli_detail = [];
    if (addtal) {
      for (let i = 0; i < addtal.length; i++) {
        upli_detail.push({
          hasDefaultInit: true,
          license_type: addtal[i].license_type,
          validity_start_date: addtal[i].validity_start_date,
          remark: addtal[i].remark,
          validity_end_date: addtal[i].validity_end_date,
          license_code: addtal[i].license_code,
          _status: "Insert"
        });
      }
    }
    if (deletetal) {
      for (let i = 0; i < deletetal.length; i++) {
        upli_detail.push({
          id: deletetal[i].id,
          _status: "Delete"
        });
      }
    }
    if (updatedetal) {
      for (let i = 0; i < updatedetal.length; i++) {
        upli_detail.push({
          id: updatedetal[i].id,
          yuan_validity_end: updatedetal[i].yuan_validity_end,
          validity_start_date: updatedetal[i].validity_start_date,
          remark: updatedetal[i].remark,
          validity_end_date: updatedetal[i].validity_end_date,
          _status: "Update"
        });
      }
    }
    let updatelience = {
      id: license_id,
      is_all_org: change_res.is_all_org,
      remarks: change_res.remark,
      SY01_customer_license_detailList: upli_detail
    };
    ObjectStore.updateById("ISY_2.ISY_2.SY01_customer_license_file", updatelience, "SY01_customer_license_file");
    return {};
  }
}
exports({ entryPoint: MyTrigger });