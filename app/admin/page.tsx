import { ArrowUpRight, ArrowDownRight, Package, Users, ShoppingBag, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome back to the CropCare Admin command center.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">₹1,24,500</h3>
            </div>
            <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
              <DollarSign className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center text-green-600 font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              12.5%
            </span>
            <span className="text-slate-500">vs last month</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Orders</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">142</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center text-green-600 font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              8.2%
            </span>
            <span className="text-slate-500">vs last month</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Customers</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">2,845</h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center text-red-600 font-medium">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              3.1%
            </span>
            <span className="text-slate-500">vs last month</span>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Products</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">94</h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
              <Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center text-green-600 font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              1.2%
            </span>
            <span className="text-slate-500">vs last month</span>
          </div>
        </div>

      </div>
      
      {/* Recent Orders Table Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {/* Dummy data for preview */}
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium">#ORD-{9834 + i}</td>
                  <td className="px-6 py-4">Ramesh Kumar</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-medium">Processing</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">Today, 10:45 AM</td>
                  <td className="px-6 py-4 font-medium">₹3,450</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
