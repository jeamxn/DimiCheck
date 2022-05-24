let i = 0;
$(window).load(()=>{
    setTimeout(() => {
        setInterval(() => {
            i += 0.0001;
            $('html').css('transform', `rotate(${i % 360}deg)`);
        }, 10);
    }, 500);
});