const getWaterDeg = () => {
  let ret;
  $.ajax({
    url: '/water',
    type: 'POST',
    async: false,
    success: res => {
      ret = res;
    }
  });
  return ret;
}
console.log(getWaterDeg());

const setWater = () => {
  const water = getWaterDeg();
  $('.water').html(`지금 한강 수온은? ${water.temp}℃`);
}

var timetable = ['', '', '', '', '', '', ''];
$(window).load(() => {
  let data = new Object(); let reload = null;
  let isRest = false;
  let todayWhat = '';
  let preBackground = '';

  const reset = () => {
      let element = $('.listText');
      for(let i = 0; i < element.length; i++){
          element[i].innerHTML = '';
      }
  }
  
  let list = [];
  let playsound;
  const change = () => {
      let all = 0;
      let none = 0;
      let inClass = 0;
      let outer = ['외출', '귀가'];
      $.ajax({
          url: '//api.dimigo.xyz/getList',
          type: 'POST',
          data: {
              data: list
          },
          success: res => {
            setWater();
              try{
                playsound.pause();
                playsound.currentTime = 0;
              } catch{}
              if(res.soundPlay) {
                playsound = new Audio(res.soundURL);
                playsound.play();
              }

              console.log(res);

              let element = $('.buttonText');
                  let list = $('.listText');
                  let data = res.data;
                  reset();
                  all += data.length;
                  for(let j = 0; j < data.length; j++){
                      for(let i = 0; i < element.length; i++){
                          if(element[i].innerText == data[j][2].replace(/\n|\r/g, "")){
                              list[i].innerHTML = `${list[i].innerHTML}${data[j][0]}${data[j][1]}<br>`
                              break;
                          }
                      }
                      if(data[j][2] == '자습') inClass++;
                      if(outer.indexOf(data[j][2]) >= 0) none++;
                  }
                  
                  $('.numNumber')[0].innerHTML = `${all}명`;
                  $('.numNumber')[1].innerHTML = `${all - none}명`;
                  $('.numNumber')[2].innerHTML = `${inClass}명`;
                  $('.numNumber')[3].innerHTML = `${none}명`;
          }
      });
  };
  
  const moniter = () => {
      let test = '';
      for(let i = 0; i < list.length; i++){
          test += `${Math.floor(list[i] / 10)}-${list[i] % 10}${i == list.length - 1 ? '' : ', '}`;
      }
      Swal.fire({
          title: '학반 입력',
          html: `모니터링 할 학반을 입력해 주세요.<br>ex) 1학년 6반 => 16<br>현재 입력 된 학반: ${test}`,
          icon: 'question',
          input: 'number',
          inputAttributes: {
              autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: '추가하기!',
          cancelButtonText: '끝내기!'
      }).then(res => {
          console.log(res);

          
      
          if(res.isConfirmed && res.value != ''){
              list.push(res.value);
              moniter();
          }
          else{
            const start = () => {
              refData(() => {
                main();
              });
            }; start();


              for(let i = 0; i < list.length; i++){
                  let grd = Math.floor(list[i] / 10);
                  let cls = list[i] % 10;
                  let f = i != list.length - 1 ? ',' : '';
                  $('.gc').html(`${$('.gc').html()} ${grd}-${cls}${f}`);
                  //console.log(grd, cls);
              }
            
              change();
              setInterval(() => {
                  change();
              }, 10000);
            
              if(list.length == 1){
                  let today = new Date();
                  let year = today.getFullYear();
                  let month = ('0' + (today.getMonth() + 1)).slice(-2);
                  let day = ('0' + today.getDate()).slice(-2);
              
                  let dateString = `${year}${month}${day}`;
                  $.ajax({
                      url: '//api.dimigo.xyz/timetable',
                      type: 'get',
                      data: {
                          date: dateString,
                          grade: Math.floor(list[0] / 10),
                          class: list[0] % 10
                      },
                      success: res => {
                          res = res['hisTimetable'][1]['row'];
                          for(let i = 0; i < res.length; i++){
                              timetable[i] = res[i]['ITRT_CNTNT'];
                          }
                          console.log(timetable);
                      }
                  })
              }
          }
      });
  }
  moniter();

  const refData = (callback) => {
    $.ajax({
      url:'/js/data.json',
      type:'GET',
      dataType:'json',
      success: result => {

        if(result.view != data.view) $('#view').attr('src', result.view);
        if(!reload) reload = result.reload;
        if(reload != result.reload) location.href = '/';
        data = result;
        let today = new Date();   

        let year = today.getFullYear();
        let month = String(today.getMonth() + 1).padStart(2, '0');
        let date = String(today.getDate()).padStart(2, '0');

        $.ajax({
          url: '//api.dimigo.xyz/today',
          type: 'GET',
          data: {
            date: `${year}${month}${date}`
          },
          success: res => {
            try{
              let data = res.SchoolSchedule[1].row;
              for(let i = 0; i < data.length; i++){
                if(data[i].SBTR_DD_SC_NM == "휴업일" || data[i].SBTR_DD_SC_NM == "공휴일") {
                  isRest = true;
                  todayWhat = `${data[i].EVENT_NM}: `;
                }
              }
            }
            catch{}
            callback();
          }
        });
       
      }
    })
  };

  const fillZero = (width, number) => {
    str = `${number}`;
    return str.length >= width ? str:new Array(width-str.length+1).join('0')+str;
  }

  const getTime = (second, type) => {
    let date = new Date(null);
    date.setSeconds(second);
    const split = date.toISOString().substr(11, 8).split(':');

    if(type == 'time') {
      if(split[0] < 12) {
        return `오전 ${split[0]}시 ${split[1]}분 ${split[2]}초`;
      } else {
        return `오후 ${fillZero(2, (split[0] != 12) ? split[0] - 12 : split[0])}시 ${split[1]}분 ${split[2]}초`;
      }
    } else if(type == 'left') {
      return `${(split[0] * 1 != 0) ? `${split[0]}:` : ''}${(split[1] * 1 != 0) ? `${split[1]}:` : ''}${split[2]}`;
    } else if(type == 'preview') {
      if(split[0] < 12) {
        return `오전 ${split[0] * 1}시 ${(split[1] == 0) ? '' : `${split[1]}분`}`;
      } else {
        return `오후 ${(split[0] != 12) ? split[0] - 12 : split[0]}시 ${(split[1] == 0) ? '' : `${split[1]}분`}`;
      }
    }
  }

  const main = () => {
    const refrech = () => {
      const time = new Date();
      const nowSecond = (time.getHours() * 60 + time.getMinutes()) * 60 + time.getSeconds();
      let count = 0;
      let curData;
      if(time.getDay() >= 1 && time.getDay() <= 5 && !isRest) {
        curData = data["평일"];
      }
      else {
        curData = data["휴일"];
      }
      for(const [key, value] of Object.entries(curData)) {
        const start0end = value.time.split('~');
        const start = start0end[0].split(':');
        const end = start0end[1].split(':');
        const startSecond = (start[0] * 60 + start[1] * 1) * 60;
        const endSecond = (end[0] * 60 + end[1] * 1) * 60;
        if(nowSecond >= startSecond && nowSecond < endSecond) {
          let nowTime = value.title.substr(0, 1) - 1;
          let isGowsi = value.title.substr(1, 2) == '교시' ? true : false;
          let nowG = '';
          if(isGowsi){
            nowG = `${timetable[nowTime]} `;
          }
          $('.nowTitle').html(`${todayWhat}${value.title} ${nowG}(${(endSecond - startSecond) / 60}분, ${getTime(endSecond - nowSecond, 'left')})`);
          const persent = (nowSecond - startSecond) / (endSecond - startSecond) * 100;
          $('.nowTitle').css('background', `linear-gradient(to right, #9492ff ${persent}%, #9dc7f0 ${persent}%)`);
          $('.nowTitle').css('-webkit-background-clip', `text`);
          $('.nowTitle').css('-webkit-text-fill-color', `transparent`);
          break;
        }
        count++;
      }
      const now = `${String(time.getHours()).padStart(2, '0')}시 ${String(time.getMinutes()).padStart(2, '0')}분 ${String(time.getSeconds()).padStart(2, '0')}초`;
      $('.nowTime').html(now);
    }; refrech();
    setInterval(() => {
      refrech();
    }, 500);
  }
});