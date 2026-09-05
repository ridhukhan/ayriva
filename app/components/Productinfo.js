import { TicketPlus } from 'lucide-react';
import { Truck } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { Undo2 } from 'lucide-react';
export default function ProductInfo(){


    return(

        <div className="bg-fuchsia-200 w-full gap-2 h-30 flex justify-center rounded-2xl">
<div className='flex flex-col'>
<h1><Truck /><span className='text-red-600 font-bold'>Delivery info</span></h1>
<p>Delivery from today to 2days</p>
</div>
<div className='flex flex-col'>
<h1><TicketPlus /><span className='text-red-600 font-bold'>Selling info</span></h1>
<p>People Are Loving it! sold 100 pcs in last 24 hour</p>
</div>
<div className='flex flex-col'>
<h1><ShieldCheck /><span className='text-red-600 font-bold'>Security info</span></h1>
<p>100% Authenticated product </p>
</div>
<div className='flex flex-col'>
<h1><Undo2 /><span className='text-red-600 font-bold'>Return info</span></h1>
<p>we have easy return policy just knock me </p>
</div>

        </div>
    )
}