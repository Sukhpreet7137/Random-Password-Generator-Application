const inputSlider=document.querySelector("[data-length-slider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMSG]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckbox=document.querySelectorAll("input[type=checkbox]");

const symbols='~!@#$%^&*()_+{}|:"<>?/.,;[]-=';
let password="";
let passwordlength=10;
let checkcount=0;
handleSlider();
// set strength color to grey
setIndicator("#ccc");
// set Password length
function handleSlider()
{  
    // Default Behavior of Slider
    inputSlider.value=passwordlength;
    lengthDisplay.innerText=passwordlength; 
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordlength-min)*100/(max-min))+ "% 100%"
}
function setIndicator(color)
{
    indicator.style.backgroundColor=color;    // shadow
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;

} 
function getRndInteger(min,max)
{
    return Math.floor(Math.random()*(max-min))+min;
}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase()
{
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUpperCase()
{
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol()
{
    // We will create array or string of symbols and return symbol on the basis of randomly generated index
    return symbols.charAt(getRndInteger(0,symbols.length-1));
}

function calcStrength()
{
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
        setIndicator("#0f0");
      } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordlength >= 6
      ) {
        setIndicator("#ff0");
      } else {
        setIndicator("#f00");
      }
}

// How to copy to clipboard(Can be a good interview Problem)==>
async function copycontent()
{
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e)
    {
        copyMsg.innerText="Failed";
    }
    // To make copied wala span visible
    copyMsg.classList.add("active");
    // Only visible for a small interval of time
    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000);
}
// // Shuffling the password which is generated
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
function handleCheckboxchange(){
    checkcount=0;
    allCheckbox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkcount++;
    })

    // Special condition
    if(passwordlength<checkcount)
    {
        passwordlength=checkcount;
        handleSlider();//To reflect changes on UI
    }
}

// // Anytime if any of check box is changes this function will implement
allCheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckboxchange);
})


inputSlider.addEventListener('input',(e)=>{
    passwordlength=e.target.value;//Changing length of Password
    handleSlider();   //UI change
})  

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copycontent();
    }
})

generateBtn.addEventListener('click',()=>{
    // None of checkbox are selected
    if(checkcount==0) return ;
    if(passwordlength<checkcount)
    {
        passwordlength=checkcount;
        handleSlider();
    }

    // Lets start journey to find new password
    
    // First remove previous Password
    password="";

    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //Compulsory Addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    // Remaining addition
    for(let i=0;i<passwordlength;i++)
    {
        let randidx=getRndInteger(0,funcArr.length);
        password+=funcArr[randidx]();
    }

    // Shuffle the password
    password=shufflePassword(Array.from(password));

    //Show in UI
    passwordDisplay.value=password;
    calcStrength();

})
 