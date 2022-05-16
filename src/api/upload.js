import { http } from "@/utils/request";


export function uploadFile(datas) {
  return http.request({
    method: "post",
    url: "/file/manyFileUpload",
    data: datas,
    header : {
      "Content-Type" : "application/x-www-form-urlencoded"
    }
  });
}






