import StartThinkmay from './tauri.js';

// document.onload = ()=>{
//     console.log('hehe')
//     document.getElementById('moonlight-click').onclick(() => {
//         StartThinkmay({address: '123.1231.1231.1231'})
//     })
// }

document.getElementById('moonlight-click').onclick = () => {
    StartThinkmay({address: '123.1231.1231.1231'})
}

// const handleThinkmay=()=>{
//     const input = document.getElementById('ipAddress')
//     console.log(input.value);
// }
// const handleMoonlight=()=>{
//     console.log('moonlight');
//     StartThinkmay({address: '192.168.1.50'});
// }
// const handleConfigure=()=>{

//     console.log('configure');
// }

