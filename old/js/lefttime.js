let data = new Object(); let reload = null;

const refData = (callback) => {
  $.ajax({
    url:'./js/data.json',
    type:'GET',
    dataType:'json',
    success:function(result) {
      data = result;
      callback();
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
    return `${(split[0] * 1 != 0) ? `${split[0]}시간` : ''} ${(split[1] * 1 != 0) ? `${split[1]}분` : ''} ${split[2]}초 남음`;
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
    if(time.getDay() == 0 || time.getDay() == 6) {
      curData = data["휴일"];
    }
    else {
      curData = data["평일"];
    }
    for(const [key, value] of Object.entries(curData)) {
      const start0end = value.time.split('~');
      const start = start0end[0].split(':');
      const end = start0end[1].split(':');

      const startSecond = (start[0] * 60 + start[1] * 1) * 60;
      const endSecond = (end[0] * 60 + end[1] * 1) * 60;

      if(nowSecond >= startSecond && nowSecond < endSecond) {

        $('#time').text(getTime(nowSecond, 'time'));
        $('.nTime').html(value.title);
        $('.leave').html(`${getTime(endSecond - nowSecond, 'left')} (${(endSecond - startSecond) / 60}분)`);

        if(key * 1 - 1 >= 0) {
          $('.pt1').html(curData[key * 1 - 1].title);

          const preStart = curData[key * 1 - 1].time.split('~')[0].split(':');
          const preEnd = curData[key * 1 - 1].time.split('~')[1].split(':');
          const preStartSecond = (preStart[0] * 60 + preStart[1] * 1) * 60;
          const preEndSecond = (preEnd[0] * 60 + preEnd[1] * 1) * 60;

          $('.pt2').html(`${getTime(preEndSecond, 'preview')} 끝남 (${(preEndSecond - preStartSecond) / 60}분)`);
        } else {
          $('.pt1').html('');
        }

        if(key * 1 + 1 < curData.length) {
          $('.nt1').html(curData[key * 1 + 1].title);

          const nextStart = curData[key * 1 + 1].time.split('~')[0].split(':');
          const nextEnd = curData[key * 1 + 1].time.split('~')[1].split(':');
          const nextStartSecond = (nextStart[0] * 60 + nextStart[1] * 1) * 60;
          const nextEndSecond = (nextEnd[0] * 60 + nextEnd[1] * 1) * 60;

          $('.nt2').html(`(${(nextEndSecond - nextStartSecond) / 60}분) ${getTime(nextStartSecond, 'preview')} 시작`);
        } else {
          $('.nt1').html('');
        }

        const persent = (nowSecond - startSecond) / (endSecond - startSecond) * 100;
        $('.nTime').css('background', `linear-gradient(to right, var(--dimigo) ${persent}%, var(--dimigo-y) ${persent}%)`);
        $('.nTime').css('-webkit-background-clip', `text`);
        $('.nTime').css('-webkit-text-fill-color', `transparent`);

        break;
      }

      count++;
    }
  }; refrech();

  setInterval(() => {
    refrech();
  }, 500);
}