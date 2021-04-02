import axios from 'axios'
import moment from 'moment'

export function initAdmin(){
    const orderTableBody = document.querySelector('#orderTableBody')
    let orders = []
    let employees = []
    let markup

    axios.get('/employee' , {
        headers:{
            "X-Requested-With" : "XMLHttpRequest"
        }
    }).then(res =>{
        employees = res.data
    }).catch(err => { 
        console.log(err)
    })


    axios.get('/admin/orders' , {
        headers:{
            "X-Requested-With" : "XMLHttpRequest"
        }
    }).then(res =>{
        orders = res.data
        markup = generateMarkup(orders,employees)
        orderTableBody.innerHTML = markup
    }).catch(err => { 
        console.log(err)
    })

    

    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p>${ menuItem.item.name } - ${ menuItem.qty } pcs :-  ${ menuItem.item.price * menuItem.qty } rs.</p>
            `
        }).join('')
      }


    function deliveryAss(employees,order) {
        let deliveryPerson = Object.values(employees)
        return deliveryPerson.map((person) => {
            
            return `
                
                <option value="${ person.uid }"${ order.did === person.uid ? 'selected' : '' }>
                ${person.name}</option>
            
            `
        }).join('')
      }

    function generateMarkup(orders,employees) {
        return orders.map(order => {
            return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <div>${ renderItems(order.items) }</div>
                </td>
                <td class="border px-4 py-2">${ order.customerId.name } </br> ${ order.address } </br> ${ order.area }</td>
                <td class="border px-4 py-2">${ order.phone }</td>
                <td class="border px-4 py-2">${ order.lpgId }</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                    <form action="/admin/delivery" method="POST">
                            <input type="hidden" name="orderId" value="${ order._id }">
                            <select name="did" onchange="this.form.submit()" selected=""
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option>Select Delivery Person</option>
                                ${deliveryAss(employees,order)}
                            </select>
                    </form>
                    <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                    </div>
                    </div>
                </td>

                <td class="border px-4 py-2">
                    ${ moment(order.createdAt).format('DD/MM/YYYY') } </br>
                    ${ moment(order.createdAt).format('hh:mm A') }
                </td>
                <td class="border px-4 py-2">
                    ${ order.paymentStatus }
                </td>
            </tr>
        `
        }).join('')
    }
}
