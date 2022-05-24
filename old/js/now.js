$(window).load(() => {
    const time = 1500;
    const showLoading = (onoff) => {
      if(onoff){
          $.ajax({
              url:`/css/loading.css`,
              dataType:"text",
              success:(data)=> {
                  $("head").append(`<style>${data}`);
                  $("head").append(`<style>@media (max-width:500px) { ${data.replace(/([0-9]+)px/g, (v) => v.replace('px', '')/5+'vw')} }</style>`);
                  $('body').prepend('<div class="fullscreen"></div>');
                  $('.fullscreen').prepend('<div class="loader loader-1"></div>');
              }
          });
      }
      else{
          $('.fullscreen').remove();
      }
  };
  $('.logo').on('click', event => {
      location.href = '/';
  });
  $('.grade').on('change', event => change($('.grade').val(), $('.class').val()));
  $('.class').on('change', event => change($('.grade').val(), $('.class').val()));
  const change = (grd, cls) => {
    if(grd == 0 || cls == 0) return;
    showLoading(true);
    //console.log(grd, cls);
    $.ajax({
        url: '//api.dimigo.xyz/get',
        type: 'POST',
        data: {
          grade: $('.grade').val(),
          class: $('.class').val()
        },
        success: res => {
          showLoading(false);
          if(res.success) {
            $('.info_grade').html(`${$('.grade').val()}학년 `);
            $('.info_class').html(`${$('.class').val()}반`);
            const all = res.data.length;
            let none = 0, in_classroom = 0;
            let info = {
              "자습": [],
              "화장실/물": [],
              "복도": [],
              "세탁": [],
              "방과후": [],
              "창동": [],
              "자동": [],
              "외출": [],
              "귀가": [],
              "기타 (학교 활동인 경우)": [],
              "기타 (학교에 없는 경우)": []
            };
            let list = ["자습", "화장실/물", "복도", "세탁", "방과후", "창동", "자동", "외출", "귀가", "기타 (학교 활동인 경우)", "기타 (학교에 없는 경우)"];
            for(let i = 0; i < all; i++){
              info[res.data[i][2]].push(`${res.data[i][0]}${res.data[i][1]} `);
            }
            for(let i in list){
              $(`.lg_div-${Number(i) + 1}`).css('display', 'flex');
              if(info[list[i]].length) {
                let infoList = info[list[i]];
                $(`.info_number-${Number(i) + 1}`).html(`${infoList.length}명`);
                $(`.who-${Number(i) + 1}`).html('');
                for(let j = 0; j < infoList.length; j++){
                  if(j % 3 == 0 && j != 0) $(`.who-${Number(i) + 1}`).html(`${$(`.who-${Number(i) + 1}`).html()}<br>${infoList[j]}`);
                  else $(`.who-${Number(i) + 1}`).html(`${$(`.who-${Number(i) + 1}`).html()} ${infoList[j]}`);
                }
              }
              else $(`.lg_div-${Number(i) + 1}`).css('display', 'none');
              
              if(['외출', '귀가', '기타 (학교에 없는 경우)'].indexOf(list[i]) >= 0) {
                none += info[list[i]].length;
                //console.log(list[i]);
              }
              if(['자습'].indexOf(list[i]) >= 0) {
                in_classroom += info[list[i]].length;
              }
            }
            $(`.all`).html(`${all}명`);
            $(`.now`).html(`${in_classroom}명`);
            $(`.now_school`).html(`${all - none}명`);
            $(`.no`).html(`${none}명`);
          }
          else Swal.fire({
            icon: 'error', 
            title: '오류!', 
            text: res.message,
            timer: time,
            timerProgressBar: true
          });
        },
        error: res => {
          Swal.fire({
            icon: 'error', 
            title: '오류!', 
            text: res.message,
            timer: time,
            timerProgressBar: true
          });
        }
      });
  };
});