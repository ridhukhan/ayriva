import { TicketPlus } from 'lucide-react';
import { Truck } from 'lucide-react';
export default function ProductInfo(){


    return(

        <div className="bg-fuchsia-200 w-fit h-30 flex justify-center text-shadow-pink-800">
<div className='flex flex-col'>
<h1><Truck className='p-3'/><span>Delivery info</span></h1>
<p>Delivery from today to 2days</p>
</div>
<div className='flex flex-col'>
<h1><TicketPlus className='p-3'/><span>Delivery info</span></h1>
<p>People Are Loving it! sold 100 pcs in last 24 hour</p>
</div>


        </div>
    )
}