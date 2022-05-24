$(window).load(() => {
  $('.login-2').css('display', 'none');
  $('.box2').css('display', 'none');
  $('.logo').on('click', event => {
    location.href = '/tv';
  });
  $('.pre').on('click', event => location.href = '');
  const time = 1500; let grade = 0, classs = 0;
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
  const getNumber = () => {
    return Math.floor($(window).width() / $('.login-2').width());
  }

  const change = (grd, cls) => {
    //console.log(getNumber());
    if(grd == 0 || cls == 0) return;
    //console.log(grd, cls);
    setTimeout(() => $('.pre').css('display', 'none'), 30000);
    $.ajax({
        url: '//api.dimigo.xyz/get',
        type: 'POST',
        data: {
          grade: grd,
          class: cls
        },
        success: res => {
          if(res.success) {
            $('.info_grade').html(`${grd}학년 `);
            $('.info_class').html(`${cls}반`);
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
            const one = () => {
              none = 0; in_classroom = 0;
              for(let i in list){
                $(`.lg_div-${Number(i) + 1}`).css('display', 'inline-block');
                if(info[list[i]].length) {
                  let infoList = info[list[i]];
                  $(`.info_number-${Number(i) + 1}`).html(`${infoList.length}명`);
                  $(`.who-${Number(i) + 1}`).html('');
                  for(let j = 0; j < infoList.length; j++){
                    if(j % Math.floor(14 / getNumber()) == 0 && j != 0) $(`.who-${Number(i) + 1}`).html(`${$(`.who-${Number(i) + 1}`).html()}<br>${infoList[j]}`);
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
            };
            one(); one();
            $(`.all`).html(`${all}명`);
            $(`.now`).html(`${in_classroom}명`);
            $(`.now_school`).html(`${all - none}명`);
            $(`.no`).html(`${none}명`);
          }
        }
      });
  };
  const clickGrade = (i) => {
    $(`.grade${i}`).on('click', () => {
      grade = i;
      $('.box1').css('display', 'none');
      $('.box2').css('display', 'block');
    });
  }
  const clickClass = (i) => {
    $(`.class${i}`).on('click', () => {
      classs = i;
      $('.login').css('display', 'none');
      $('.login-2').css('display', 'inline-block');
      change(grade, classs);
      setInterval(() => change(grade, classs), 10000);
    });
  }
  clickGrade(1); clickGrade(2); clickGrade(3);
  clickClass(1); clickClass(2); clickClass(3);
  clickClass(4); clickClass(5); clickClass(6);
});