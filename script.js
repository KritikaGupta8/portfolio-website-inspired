const scroll = new LocomotiveScroll({
el:
document.querySelector('#main'),
smooth: true
});

function firstPageAnim(){
    var tl = gsap.timeline(); //Timeline ek sequence hoti hai jisme multiple animations ko ek ke baad ek ya saath mein chalaya ja sakta hai.

    tl.from("#nav", {
        y: '-10', //Matlab element 10 pixels upar se start hoga aur apni normal position par aa jayega.
        opacity: 0, //Matlab element pehle invisible hoga aur phir gradually visible ho jayega.
        duration: 1.5, //Animation 1.5 seconds tak chalega.
        ease: Expo.easeInOut //Yeh easing function hai jo animation ko smooth banata hai — start aur end mein slow, beech mein fast.
    })

    .to(".boundingelem", {
        y: 0,
        ease: Expo.easeInOut,
        duration: 2,
        delay: -1,
        stagger: 0.2 //Matlab agar multiple elements hain to unke animations 0.2 seconds ke gap se start honge.
        
    })

    .from("#herofooter", {
        y: -10,
        opacity: 0,
        duration: 1.5,
        delay: -1, //Matlab yeh animation pehle wale animation ke 1 second pehle start hoga, isse dono animations overlap karenge.
        ease: Expo.easeInOut
    })
}


//jab mouse move kr rha h to circle ko skew kar paye, also max skew & min skew define kr paye
//mouse move krne pr chapta hone ki value bdhe aur jb mouse ruk jaye to chapta hta lo


var timeout; //Timeout ID store karenge, taaki hum usse clear kar sakein jab mouse ruk jaye.

function circleChaptaKaro(){

    //define default scale values for the circle
    var xscale = 1; //Matlab circle ki width normal hai.
    var yscale = 1; //Matlab circle ki height normal hai.

    var xprev = 0; //Matlab pehle mouse ki X position 0 thi.
    var yprev = 0;

    window.addEventListener("mousemove", function(dets){
        //var xdiff = dets.clientX - xprev; //Matlab mouse ki current X position aur pehle ki X position ke beech ka difference, jisse pata chalega ki mouse kitna move hua hai.
        
        clearTimeout(timeout); //Matlab agar mouse move kar raha hai to pehle se set timeout ko clear kar do, taaki chapta effect tab tak rahe jab tak mouse move kar raha hai.

        xscale = gsap.utils.clamp(.8, 1.2, dets.clientX - xprev);
        yscale = gsap.utils.clamp(.8, 1.2, dets.clientY - yprev);

        xprev = dets.clientX; //Ab pehle ki X position ko current X position se update kar diya, taaki next mouse move event mein sahi difference calculate ho sake.
        yprev = dets.clientY;

        //console.log(xdiff, ydiff);

        circleMouseFollower(xscale, yscale);

        timeout = setTimeout(function(){
                document.querySelector("#minicircle").style.transform = `translate(${dets.clientX}px, ${dets.clientY}px) scale(1, 1)`;  //Matlab mouse ke move karne ke baad 100 milliseconds ke delay ke baad circle ko normal size mein le aao, taaki chapta effect thoda time ke liye hi rahe.
        }, 100);
});
}

circleChaptaKaro();

function circleMouseFollower(xscale, yscale){
    window.addEventListener("mousemove", function(dets){
        // console.log(dets);
        document.querySelector("#minicircle").style.transform = `translate(${dets.clientX}px, ${dets.clientY}px) scale(${xscale}, ${yscale})`; 
    })
}

circleMouseFollower();
firstPageAnim();


//teeno elements ko select kro, uke baad teeno pr ek mousemove lagao; jab mousemove ho to ye pta kro ki mouse kaha pr h i.e. mouse ki x & y position pta kro
//x&y position ke badle uss image ko show kro and uss image ko move kro; move krte vkt rotate kro, and jaise jaise mouse tez chale vaise-vaise rotation bhi tez ho jaye

document.querySelectorAll(".elem").forEach(function (elem){
    var rotate = 0; //initial rotation degree 0 h
    var diffrot = 0; //initial rotation difference 0 h


    elem.addEventListener("mouseleave", function(dets) {

        gsap.to(elem.querySelector("img"), {
            opacity: 0,
            ease: Power3, 
            duration: .5,
        });
    });


    elem.addEventListener("mousemove", function(dets) {
        var diff = dets.clientY - elem.getBoundingClientRect().top; //Matlab mouse ki current Y position aur element ke top edge ke beech ka difference, jisse pata chalega ki mouse element ke andar kitna move hua hai.
        diffrot = dets.clientX - rotate;
        rotate = dets.clientX; //Ab pehle ki rotation degree ko current mouse X position se update kar diya, taaki next mouse move event mein sahi rotation difference calculate ho sake.
        gsap.utils.clamp(-20, 20, diffrot);

        gsap.to(elem.querySelector("img"), {
            opacity: 1,
            ease: Power3, 
            top: diff, //Matlab image ki top position ko mouse ke Y position ke hisaab se adjust karo, taaki image mouse ke move karne par uske andar move hoti rahe.
            left: dets.clientX,
            rotate: gsap.utils.clamp(-20, 20, diffrot * .8),
        });
    });
});