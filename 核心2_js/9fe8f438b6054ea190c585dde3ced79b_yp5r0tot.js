let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var mapviewtype = request.mapviewtype;
    var distance = request.distance; // 米
    var centerLng = request.centerLng;
    var centerLat = request.centerLat;
    if (!mapviewtype) {
      throw new Error("地图视图类型不能为空，请检查!");
    }
    if (mapviewtype != "1") {
      throw new Error("地图视图类型与数据接口类型不对应，请检查!");
    }
    if (!distance) {
      distance = 10000;
    }
    if (!centerLng || !centerLat) {
      centerLng = 113.328657;
      centerLat = 22.703002;
    }
    // 根据中心 经纬度和显示距离，分别计算出 经度和纬度的上下限
    var a = 6378137;
    var b = 6356752.3142;
    var f = 1 / 298.2572236;
    function rad(d) {
      return (d * Math.PI) / 180.0;
    }
    function deg(x) {
      return (x * 180) / Math.PI;
    }
    function getLatlngByFixedPointAziDistance(brng, dist, fixedPoint) {
      var lon = fixedPoint.longitude;
      var lat = fixedPoint.latitude;
      var alpha1 = rad(brng);
      var sinAlpha1 = Math.sin(alpha1);
      var cosAlpha1 = Math.cos(alpha1);
      var tanU1 = (1 - f) * Math.tan(rad(lat));
      var cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1);
      var sinU1 = tanU1 * cosU1;
      var sigma1 = Math.atan2(tanU1, cosAlpha1);
      var sinAlpha = cosU1 * sinAlpha1;
      var cosSqAlpha = 1 - sinAlpha * sinAlpha;
      var uSq = (cosSqAlpha * (a * a - b * b)) / (b * b);
      var A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
      var B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
      var cos2SigmaM = 0;
      var sinSigma = 0;
      var cosSigma = 0;
      var sigma = dist / (b * A);
      var sigmaP = 2 * Math.PI;
      while (Math.abs(sigma - sigmaP) > 1e-12) {
        cos2SigmaM = Math.cos(2 * sigma1 + sigma);
        sinSigma = Math.sin(sigma);
        cosSigma = Math.cos(sigma);
        var deltaSigma =
          B * sinSigma * (cos2SigmaM + (B / 4) * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - (B / 6) * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
        sigmaP = sigma;
        sigma = dist / (b * A) + deltaSigma;
      }
      var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
      var lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1, (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp));
      var lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1);
      var C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
      var L = lambda - (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
      var revAz = Math.atan2(sinAlpha, -tmp); // final bearing
      return { lat: deg(lat2), lon: lon + deg(L) };
    }
    var latTop = getLatlngByFixedPointAziDistance(0, distance, { longitude: centerLng, latitude: centerLat });
    var lonTop = getLatlngByFixedPointAziDistance(90, distance, { longitude: centerLng, latitude: centerLat });
    var latBottom = getLatlngByFixedPointAziDistance(180, distance, { longitude: centerLng, latitude: centerLat });
    var lonBottom = getLatlngByFixedPointAziDistance(270, distance, { longitude: centerLng, latitude: centerLat });
    var querySaleSql =
      "select id,code,name,mnemonic,codebianma,org.name,longitude,latitude FROM aa.store.Store where longitude < " +
      lonTop.lon +
      " and longitude > " +
      lonBottom.lon +
      " and latitude < " +
      latTop.lat +
      " and latitude > " +
      latBottom.lat;
    var resultSales = ObjectStore.queryByYonQL(querySaleSql, "yxybase");
    return { data: resultSales };
  }
}
exports({ entryPoint: MyAPIHandler });