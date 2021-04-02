import axios from 'axios'
import moment from 'moment'
import Noty from 'noty'
import { initAdmin } from './admin'
import { initDelivery } from './delivery'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')
let removeEmployee = document.querySelectorAll('.remove-employee')


function updateCart(item){
    axios.post('update-cart', item).then(res => {  
         console.log(res) 
         cartCounter.innerText = res.data.totalQty
         new Noty({
             type: 'success',
             timeout: 1000,
             text: 'Item added to cart',
             progressBar: false
         }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let item = JSON.parse(btn.dataset.item)
        console.log(item)
        updateCart(item)
        
    })
})

const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    },2000)
}

initAdmin()
initDelivery()

//change order status
let statuses = document.querySelectorAll('.status-line')
let hiddenInput = document.querySelector('#hiddenInput')
let time = document.createElement('small')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
function updateStatus(order){
    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) =>{
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if(dataProp === order.status){
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('DD/MM/YYYY hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
            
        }
    })
}

updateStatus(order);

//socket
let socket = io() 

if(order){
    socket.emit('join' , `order_${order._id}`)
}


socket.on('orderUpdated', (data)=>{
    const updateOrder = { ...order }
    updateOrder.updatedAt = moment().format()
    updateOrder.status = data.status
    updateStatus(updateOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Status Updated',
        progressBar: false
    }).show();
})

function deleteEmployee(employee){
    axios.post('remove-employee', employee).then(res =>{
         new Noty({
             type: 'success',
             timeout: 2000,
             text: 'Employee Removed',
             progressBar: false
         }).show();
    })
}

removeEmployee.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let employee = JSON.parse(btn.dataset.emp)
        console.log(employee)
        deleteEmployee(employee)
        
    })
})