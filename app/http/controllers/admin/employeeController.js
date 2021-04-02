const Employee = require('../../../models/user')

function employeeController() {
    return {
        async index(req, res){
                const employee = await Employee.find({role : {$eq : 'delivery'}}, null, {sort: {'createdAt': -1}})
                if(req.xhr) {
                    return res.json(employee)
                } else {
                    res.render('./admin/myemployee', {employees : employee})
                }
                
            },
            delete(req,res){
                console.log(req.body)
                 Employee.deleteOne({uid: req.body.uid}, (err, res) => {
                         if (err) {
                             console.log(err)
                         }
                         else {
                             console.log(res)
                         }
                     })
                return res.redirect('/employee')
               // return res.redirect('/employee') 
            }
        
        }
    }

module.exports = employeeController 