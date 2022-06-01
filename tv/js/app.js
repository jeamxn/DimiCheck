$(window).load(() => {
  let data = new Object(); let reload = null;
  let isRest = false;
  let todayWhat = '';
  let preBackground = '';
  

  const getBackground = () => {
    $.ajax({
      url: '/js/background.json',
      type: 'post',
      success: res => {
        if(preBackground != res.url){
          preBackground = res.url;
          $('.background').attr('src', `${res.url}?autoplay=1&mute=1&loop=1&controls=1`);
        }
      }
    });
  };
  getBackground(); setInterval(() => {
    getBackground();
  }, 10000);

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
            let data = res.SchoolSchedule[1].row;
            for(let i = 0; i < data.length; i++){
              if(data[i].SBTR_DD_SC_NM == "휴업일" || data[i].SBTR_DD_SC_NM == "공휴일") {
                isRest = true;
                todayWhat = `${data[i].EVENT_NM}: `;
              }
            }
            callback();
          }
        });
       
      }
    })
  };
  const start = () => {
    refData(() => {
      main();
    });
  }; start();

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
      const nowSecond = (time.getHours() * 60 + time.getMinutes()) * 60 + time.getSeconds() - 40;
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
          $('.nowTitle').css('background', `rgba(0, 0, 0, 1)`);
          //$('.nowTitle').css('background', `linear-gradient(to right, #9dc7f0 ${persent}%, #f0f0f0 ${persent}%)`);
          $('.nowTitle').css('-webkit-background-clip', `text`);
          $('.nowTitle').css('-webkit-text-fill-color', `transparent`);
          break;
        }
        count++;
      }
    }; refrech();
    setInterval(() => {
      refrech();
    }, 500);
  }
});