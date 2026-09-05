import { TicketPlus, Truck, ShieldCheck, Undo2 } from "lucide-react";

export default function ProductInfo() {
  return (
    <div className="w-full bg-fuchsia-100 p-4 rounded-2xl border border-fuchsia-200 my-4">
      {/* 
        - grid-cols-2: মোবাইলে ও ল্যাপটপে ২ লাইনে ২টা করে দেখাবে (মোট ৪টি)
        - h-auto: হাইট ফ্লেক্সিবল থাকবে, ফলে নিচের ফর্মের ওপর উঠে যাবে না
      */}
      <div className="grid grid-cols-2 gap-3 text-left">
        {/* ১. Delivery Info */}
        <div className="bg-white p-3 rounded-xl shadow-xs border border-fuchsia-50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Truck className="w-5 h-5 text-red-600 shrink-0" />
              <h3 className="text-red-600 font-bold text-xs sm:text-sm">
                Delivery info
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-700 leading-tight">
              Delivery from today to 2 days
            </p>
          </div>
        </div>

        {/* ২. Selling Info */}
        <div className="bg-white p-3 rounded-xl shadow-xs border border-fuchsia-50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <TicketPlus className="w-5 h-5 text-amber-600 shrink-0" />
              <h3 className="text-red-600 font-bold text-xs sm:text-sm">
                Selling info
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-700 leading-tight">
              Sold 100+ pcs in last 24 hours!
            </p>
          </div>
        </div>

        {/* ৩. Security Info */}
        <div className="bg-white p-3 rounded-xl shadow-xs border border-fuchsia-50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="text-red-600 font-bold text-xs sm:text-sm">
                Security info
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-700 leading-tight">
              100% Authenticated product
            </p>
          </div>
        </div>

        {/* ৪. Return Info */}
        <div className="bg-white p-3 rounded-xl shadow-xs border border-fuchsia-50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Undo2 className="w-5 h-5 text-blue-600 shrink-0" />
              <h3 className="text-red-600 font-bold text-xs sm:text-sm">
                Return info
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-700 leading-tight">
              Easy return policy available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}