import {
  CreditCard,
  Receipt,
} from "lucide-react";

const PaymentCard = ({ payment }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-emerald-500/20 p-3">
          <CreditCard className="h-6 w-6 text-emerald-400" />
        </div>

        <h2 className="text-xl font-semibold text-white">
          Payment Details
        </h2>

      </div>

      <div className="mt-6 space-y-4">

        <div className="flex justify-between">

          <span className="text-gray-400">
            Amount
          </span>

          <span className="font-semibold text-white">
            {payment.amount}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-400">
            Status
          </span>

          <span className="font-semibold text-emerald-400">
            {payment.status}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-400">
            Transaction
          </span>

          <span className="font-semibold text-white">
            {payment.transactionId}
          </span>

        </div>

      </div>

      <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-white transition hover:bg-white/20">

        <Receipt size={18} />

        Download Invoice

      </button>

    </div>
  );
};

export default PaymentCard;