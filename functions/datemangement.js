var dayjs = require('dayjs');

module.exports.dateManagement = (date) =>{
    console.log(date);
    return new Date(date).toLocaleDateString();
}

module.exports.validateDate = (date) =>{
    const dayinmonth = (date)=>{
        const d= new Date(date);
        return new Date(d.getFullYear(), d.getMonth()+1,0).getDate();
    }

    const d = new Date(date).getDate();
    const m = new Date(date).getMonth();

    return d>0 && m>=0 && m<12 && d<dayinmonth(date)
}

module.exports.dateformat = (date) => {
    const datepattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if(datepattern.test(date)){

        const datePart = date.split('/');
        const month = datePart[0];
        const day = datePart[1].padStart(2,'0');
        const year = datePart[2].padStart(2,'0');

        return `${year}-${month}-${day}}`

    }
}
